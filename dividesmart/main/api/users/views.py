from django.contrib.auth import get_user
from django.http import (
    HttpResponseNotFound, HttpResponse, HttpResponseForbidden, JsonResponse,
    HttpResponseBadRequest
)
from django.views.decorators.csrf import csrf_exempt

from main.models import (
    User, Group, Entry, Debt, Bill, Payment
)
from main.utils import (
    ensure_authenticated,
)
import ujson as json
import uuid


def groups_to_dict(groups):
    return [group_to_dict(g) for g in groups]


@ensure_authenticated
def user(request, user_id):
    # Can only look at this user if you are a friend of this user
    # or you are this user, or you are in the same group as this user
    if request.method != 'GET':
        # TODO: Unless you are this user?
        return HttpResponseForbidden('Cannot modify this user')
    current_user = get_user(request)
    is_related = (current_user.id == user_id) \
                 or (current_user.friends.filter(id=user_id).exists()) \
                 or (
                    Group.objects
                    .filter(users__id=user_id)
                    .filter(users__id=current_user.id)
                    .exists()
                 )
    if not is_related:
        return HttpResponseForbidden('Cannot view this user')
    other_user = User.objects.get(id=user_id)
    return JsonResponse(other_user.to_dict_for_others(current_user))


@csrf_exempt
@ensure_authenticated
def friends(request, user_id):
    current_user = get_user(request)
    if current_user.id != user_id:
        return HttpResponseForbidden('Cannot view this user\'s friends')
    if request.method == 'GET':
        return JsonResponse({
            'friends': User.to_dicts_for_others(
                users=current_user.friends.all(), for_user=current_user,
                for_group=None, show_debt=True
            ),
            'invites': {
                'sent': User.to_dicts_for_others(
                    users=current_user.requested_friends.all(),
                    for_user=current_user, for_group=None, show_debt=False
                ),
                'received': User.to_dicts_for_others(
                    users=current_user.received_friend_requests.all(),
                    for_user=current_user, for_group=None, show_debt=False
                ),
            }
        })

    if request.method == 'POST':
        # Request friendship with this user id
        # Or accept friendship with this user id
        try:
            friend_id = uuid.UUID(request.POST.get('friend_id', None))
            other_user = User.objects.filter(id=friend_id).first()
        except ValueError:
            return HttpResponseBadRequest('Invalid friend id')

        if not other_user:
            return HttpResponseNotFound('No such user')
        received_fr = (
            current_user.received_friend_requests.filter(id=friend_id).first()
        )
        if received_fr:
            current_user.received_friend_requests.remove(other_user)
            current_user.friends.add(other_user)
            Debt.objects.create(user=current_user, other_user=other_user)
            Debt.objects.create(user=other_user, other_user=current_user)
            current_user.save()
            other_user.save()
            return HttpResponse('Friend request accepted')
        else:
            current_user.requested_friends.add(other_user)
            current_user.save()
            other_user.save()
            return HttpResponse('Friend request sent')
    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def friend(request, user_id, friend_id):
    current_user = get_user(request)
    if current_user.id != user_id:
        return HttpResponseForbidden('Cannot modify this user\'s friends')
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'DELETE':
        # Delete friendship / request with this user id
        current_user.received_friend_requests.remove(friend_user)
        current_user.requested_friends.remove(friend_user)
        current_user.friends.remove(friend_user)
        current_user.save()
        friend_user.save()
        return HttpResponse('Friend removed')
    return HttpResponseNotFound('Invalid request')


@csrf_exempt
@ensure_authenticated
def groups(request, user_id):
    current_user = get_user(request)
    if current_user.id != user_id:
        return HttpResponseForbidden('Cannot view this user\'s groups')
    if request.method == 'GET':
        # get all groups for this user
        return JsonResponse({
            'groups': Group.to_dicts(current_user.joined_groups.all()),
            'invites': Group.to_dicts(current_user.group_invites.all())
        })
    if request.method == 'POST':
        return HttpResponse('nice POST')
    return HttpResponseNotFound('Invalid request')


def group(request, user_id, group_id):
    pass


@csrf_exempt
@ensure_authenticated
def friend_entries(request, user_id, friend_id):
    current_user = get_user(request)
    if current_user.id != user_id:
        return HttpResponseForbidden('Cannot modify this user')
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'GET':
        # TODO: Add pagination
        entries = (
            Entry.objects
            .filter(group=None)
            .filter(participants__id=user_id)
            .filter(participants__id=friend_id)
            .order_by('-date_created', 'name')
            .all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user) for e in entries]
        })
    return HttpResponse()


@csrf_exempt
@ensure_authenticated
def friend_bills(request, user_id, friend_id):
    current_user = get_user(request)
    if current_user.id != user_id:
        return HttpResponseForbidden('Cannot modify this user')
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'POST':
        try:
            initiator_id = uuid.UUID(request.POST.get('initiator', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid initiator')

        if not initiator_id or (initiator_id != user_id and initiator_id != friend_id):
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
        if len(loans) != 1:
            return HttpResponseBadRequest('Invalid number of loans')

        actual_loans = {}
        total_loan_amt = 0
        for loan_user_id, loan_amt in loans.items():
            try:
                loan_user_id = uuid.UUID(loan_user_id)
            except ValueError:
                return HttpResponseBadRequest('Invalid loan user')
            if loan_user_id == initiator.id:
                return HttpResponseBadRequest(
                    'Initiator cannot receive own loan')
            if loan_user_id != user_id and loan_user_id != friend_id:
                return HttpResponseBadRequest('Invalid loan user')
            total_loan_amt += loan_amt
            loan_user = User.objects.get(id=loan_user_id)
            actual_loans[loan_user] = loan_amt

        if total_loan_amt > amount:
            return HttpResponseBadRequest(
                'Loan sums do not make sense with total amount')

        bill = Bill.objects.create_bill(
            name, None, creator, initiator, amount, actual_loans
        )
        return JsonResponse(bill.to_dict_for_user(current_user))
    return HttpResponseNotFound('Invalid Request')


@csrf_exempt
@ensure_authenticated
def friend_payments(request, user_id, friend_id):
    current_user = get_user(request)
    if current_user.id != user_id:
        return HttpResponseForbidden('Cannot modify this user')
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'POST':
        amount = float(request.POST.get('amount', -1))
        if amount <= 0:
            return HttpResponseBadRequest('Invalid payment amount')
        payment = Payment.objects.create_payment(
            group=None,
            creator=current_user,
            amount=amount,
            receiver=friend_user
        )
        return JsonResponse(payment.to_dict())

    return HttpResponseNotFound('Invalid Request')
