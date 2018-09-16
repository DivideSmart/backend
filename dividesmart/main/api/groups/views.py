from django.http import (
    HttpResponse, HttpResponseNotFound, HttpResponseBadRequest,
    HttpResponseForbidden, JsonResponse
)
from django.views.decorators.csrf import csrf_exempt
from main.utils import (
    ensure_authenticated, other_users_to_dict
)
from main.forms import CreateGroupForm
from main.models import (
    Group, User, Debt, Entry, Bill
)
from django.contrib.auth import get_user
import ujson as json


@csrf_exempt
@ensure_authenticated
def groups(request):
    if request.method == 'POST':
        current_user = get_user(request)
        form = CreateGroupForm(request.POST)
        if not form.is_valid():
            return HttpResponseBadRequest('Invalid parameters')
        Group.objects.create_group(form.cleaned_data['name'], current_user)
        return HttpResponse('group created')
    return HttpResponseNotFound('Invalid request')

@csrf_exempt
@ensure_authenticated
def group(request, group_id):
    if request.method != 'GET':
        return HttpResponseNotFound('Invalid Request')
    
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    return HttpResponse(group.name)


@csrf_exempt
@ensure_authenticated
def group_members(request, group_id):
    if request.method != 'GET':
        return HttpResponseNotFound('Invalid request')
    # must be a member of this group to view other members
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    return JsonResponse({
        'members': other_users_to_dict(
            group.users.all(), current_user, True, group)
    })


@csrf_exempt
@ensure_authenticated
def group_invites(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')

    if request.method == 'GET':
        # Get all invited users
        return JsonResponse({
            'invites': other_users_to_dict(
                group.invited_users.all(), current_user, False, group)
        })

    if request.method == 'POST':
        # Invite a new user
        invite_user = User.objects.filter(
            pk=request.POST.get('user_id', None)).first()
        if not invite_user:
            return HttpResponseNotFound('Invalid user id')
        group.invited_users.add(invite_user)
        group.save()
        return HttpResponseNotFound('user invited')

    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def group_invite(request, group_id, invite_id):
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'DELETE':
        # Delete an invited user
        invited_user = group.invited_users.filter(pk=invite_id).first()
        if not invited_user:
            return HttpResponseNotFound('No such invited user')
        group.invited_users.remove(invited_user)
        group.save()
        return HttpResponse('Invite deleted')
    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def group_accept(request, group_id):
    # Accept group invite
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_invited_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'POST':
        current_members = group.users.all()
        group.users.add(current_user)
        group.invited_users.remove(current_user)
        group.save()
        for member in current_members:
            Debt.objects.create(group=group, user=current_user, other_user=member)
            Debt.objects.create(group=group, user=member, other_user=current_user)
        return HttpResponse('Joined group')
    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def group_decline(request, group_id):
    # Decline group invite
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_invited_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'POST':
        group.invited_users.remove(current_user)
        group.save()
        return HttpResponse('Declined group invite')
    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def group_entries(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'GET':
        # TODO: Add pagination
        entries = (
            Entry.objects
            .filter(group=group)
            .order_by('-date_created')
            .all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user) for e in entries]
        })
    return HttpResponse()


def group_bills(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(pk=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'POST':
        group_member_ids = set(m.pk for m in group.users.all())
        initiator_id = int(request.POST.get('initiator', None))
        if not initiator_id or initiator_id not in group_member_ids:
            return HttpResponseBadRequest('Invalid initiator')
        initiator = User.objects.get(pk=initiator_id)
        name = request.POST.get('name', None)
        creator = current_user
        amount = float(request.POST.get('amount', None))
        loans = json.loads(request.POST.get('loans', None))

        if not name:
            return HttpResponseBadRequest('Invalid name')
        if not amount or amount <= 0:
            return HttpResponseBadRequest('Invalid amount')
        if not loans:
            return HttpResponseBadRequest('Invalid loans')

        actual_loans = {}
        total_loan_amt = 0
        for loan_user_id, loan_amt in loans.items():
            loan_user_id = int(loan_user_id)
            if loan_user_id == initiator.pk:
                return HttpResponseBadRequest(
                    'Initiator cannot receive own loan')
            if loan_user_id not in group_member_ids:
                return HttpResponseBadRequest('Invalid loan user not in group')
            total_loan_amt += loan_amt
            loan_user = User.objects.get(pk=loan_user_id)
            actual_loans[loan_user] = loan_amt

        if total_loan_amt > amount:
            return HttpResponseBadRequest(
                'Loan sums do not make sense with total amount')

        bill = Bill.objects.create_bill(
            name, group, creator, initiator, amount, actual_loans
        )
        return JsonResponse(bill.to_dict_for_user(current_user))
    return HttpResponse()


def group_payments(request, group_id):
    pass
