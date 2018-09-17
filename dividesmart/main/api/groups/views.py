import uuid

import ujson as json
from django.contrib.auth import get_user
from django.http import (
    HttpResponse, HttpResponseNotFound, HttpResponseBadRequest,
    HttpResponseForbidden, JsonResponse
)
from django.views.decorators.csrf import csrf_exempt

from main.forms import CreateGroupForm
from main.models import (
    Group, User, Debt, Entry, Bill, Payment
)
from main.utils import (
    ensure_authenticated
)


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
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    return JsonResponse({
        'name': group.name
    })


@csrf_exempt
@ensure_authenticated
def group_members(request, group_id):
    if request.method != 'GET':
        return HttpResponseNotFound('Invalid request')
    # must be a member of this group to view other members
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    return JsonResponse({
        'members': User.to_dicts_for_others(
            users=group.users.all(), for_user=current_user, for_group=group,
            show_debt=True
        )
    })


@csrf_exempt
@ensure_authenticated
def group_invites(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')

    if request.method == 'GET':
        # Get all invited users
        return JsonResponse({
            'invites': User.to_dicts_for_others(
                users=group.invited_users.all(), for_user=current_user,
                for_group=group, show_debt=False
            )
        })

    if request.method == 'POST':
        # Invite a new user
        try:
            invited_user_id = uuid.UUID(request.POST.get('user_id', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid user id')

        invite_user = User.objects.filter(id=invited_user_id).first()
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
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'DELETE':
        # Delete an invited user
        invited_user = group.invited_users.filter(id=invite_id).first()
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
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_invited_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'POST':
        group.add_member(current_user)
        Debt.objects.create_debt_for_group(current_user, group)
        return HttpResponse('Joined group')
    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def group_decline(request, group_id):
    # Decline group invite
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
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
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'GET':
        # TODO: Add pagination
        entries = (
            Entry.objects.filter(group=group).order_by('-date_created').all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user) for e in entries]
        })
    return HttpResponse()


@csrf_exempt
@ensure_authenticated
def group_bills(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'POST':
        group_member_ids = set(m.id for m in group.users.all())
        try:
            initiator_id = uuid.UUID(request.POST.get('initiator', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid initiator')

        if not initiator_id or initiator_id not in group_member_ids:
            return HttpResponseBadRequest('Invalid initiator')
        initiator = User.objects.get(id=initiator_id)
        name = request.POST.get('name', None)
        creator = current_user
        amount = float(request.POST.get('amount', -1))
        loans = json.loads(request.POST.get('loans', "{}"))

        if not name:
            return HttpResponseBadRequest('Invalid name')
        if not amount or amount <= 0:
            return HttpResponseBadRequest('Invalid amount')
        if not loans:
            return HttpResponseBadRequest('Invalid loans')

        actual_loans = {}
        total_loan_amt = 0
        for loan_user_id, loan_amt in loans.items():
            try:
                loan_user_id = uuid.UUID(loan_user_id)
            except ValueError:
                return HttpResponseBadRequest('Invalid loan user id')
            if loan_user_id == initiator.id:
                return HttpResponseBadRequest(
                    'Initiator cannot receive own loan')
            if loan_user_id not in group_member_ids:
                return HttpResponseBadRequest('Invalid loan user not in group')
            total_loan_amt += loan_amt
            loan_user = User.objects.get(id=loan_user_id)
            actual_loans[loan_user] = loan_amt

        if total_loan_amt > amount:
            return HttpResponseBadRequest(
                'Loan sums do not make sense with total amount')

        bill = Bill.objects.create_bill(
            name, group, creator, initiator, amount, actual_loans
        )
        return JsonResponse(bill.to_dict_for_user(current_user))
    return HttpResponseNotFound('Invalid Request')


@csrf_exempt
@ensure_authenticated
def group_payments(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'POST':
        amount = float(request.POST.get('amount', -1))
        if amount <= 0:
            return HttpResponseBadRequest('Invalid payment amount')

        try:
            receiver_id = uuid.UUID(request.POST.get('receiver', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid receiver id')

        receiver = group.users.filter(id=receiver_id).first()
        if not receiver:
            return HttpResponseBadRequest('No such receiver in group')
        payment = Payment.objects.create_payment(
            group=group,
            creator=current_user,
            amount=amount,
            receiver=receiver
        )
        return JsonResponse(payment.to_dict())
    return HttpResponseNotFound('Invalid Request')
