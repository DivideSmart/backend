import ujson as json
import uuid
from decimal import Decimal
from functools import wraps

from django.contrib.auth import get_user
from django.http import (
    HttpResponseNotFound, HttpResponse, HttpResponseForbidden, JsonResponse,
    HttpResponseBadRequest
)
from django.views.decorators.csrf import csrf_exempt

from main.models import (
    User, Group, Entry, Bill, Payment
)
from main.utils import (
    ensure_authenticated,
)


def ensure_friends(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        request, friend_id = args[0], kwargs.get('friend_id', '')
        current_user = get_user(request)
        if not current_user.friends.filter(id=friend_id).exists():
            return HttpResponseNotFound('No such friend')
        return f(*args, **kwargs)
    return wrapper


def user(request):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    return JsonResponse(current_user.to_dict_for_self())


def get_all_friends(current_user):
    return JsonResponse({
        'friends': User.to_dicts_for_others(
            users=current_user.friends.all(), for_user=current_user,
            show_debt=True
        ),
        'invites': {
            'sent': User.to_dicts_for_others(
                users=current_user.requested_friends.all(),
                for_user=current_user, show_debt=False
            ),
            'received': User.to_dicts_for_others(
                users=current_user.received_friend_requests.all(),
                for_user=current_user, show_debt=False
            ),
        }
    })


@ensure_authenticated
def friends(request):
    current_user = get_user(request)
    if request.method == 'GET':
        return get_all_friends(current_user)
    if request.method == 'POST':
        # Request friendship with this user id
        # Or accept friendship with this user id
        req_json = json.loads(request.body)
        try:
            friend_email = req_json.get('friend_email', None)
            other_user = User.objects.filter(email_address=friend_email).first()
        except ValueError:
            return HttpResponseBadRequest('Invalid email address')

        if not other_user:
            return HttpResponseNotFound('No such user')
        print(other_user)
        received_fr = current_user.has_friend_request(from_user_id=other_user.id)
        print(received_fr)
        if received_fr:
            current_user.accept_friend_request(from_user=other_user)
            return HttpResponse('Friend request accepted')
        else:
            current_user.send_friend_request(other_user)
            return HttpResponse('Friend request sent')
    return HttpResponseNotFound('Invalid request')


@ensure_authenticated
@ensure_friends
def friend(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'GET':
        return JsonResponse(
            friend_user.to_dict_for_others(current_user, show_debt=True)
        )
    if request.method == 'DELETE':
        # Delete friendship / request with this user id
        current_user.received_friend_requests.remove(friend_user)
        current_user.requested_friends.remove(friend_user)
        current_user.friends.remove(friend_user)
        current_user.save()
        friend_user.save()
        return HttpResponse('Friend removed')
    return HttpResponseNotFound('Invalid request')


@ensure_authenticated
def groups(request):
    current_user = get_user(request)
    if request.method == 'GET':
        # get all groups for this user
        return JsonResponse({
            'groups': Group.to_dicts(current_user.joined_groups.all()),
        })
    if request.method == 'POST':
        return HttpResponse('nice POST')
    return HttpResponseNotFound('Invalid request')


@ensure_authenticated
@ensure_friends
def friend_entries(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.get(id=friend_id)
    if request.method == 'GET':
        # TODO: Add pagination
        entries = (
            Entry.objects
            .filter(initiator__id__in=[current_user.id, friend_id])
            .filter(participants__id=current_user.id)
            .filter(participants__id=friend_id)
            .order_by('-date_created', 'name')
            .all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user, friend_user) for e in entries]
        })
    return HttpResponseBadRequest('Invalid Request')


# @ensure_authenticated
# @ensure_friends
# def friend_bill(request, friend_id, bill_id):
#     current_user = get_user(request)
#     old_bill = Bill.objects.filter(id=bill_id).first()
#     if not old_bill or old_bill.group:
#         return HttpResponseBadRequest('No such bill')
#
#     participant_ids = [p.id for p in old_bill.participants.all()]
#     is_friend_bill = (
#         len(participant_ids) == 2 and
#         all(i in (current_user.id, friend_id) for i in participant_ids)
#     )
#     if not is_friend_bill:
#         return HttpResponseBadRequest('No such bill')
#     # TODO: Add GET?
#     if request.method == 'PUT':
#         # Copied from POST bill
#         # Changed content-type: application/json
#         # Now we need to load the json object in the request
#         if not request.body:
#             return HttpResponseBadRequest('Invalid request')
#         req_json = json.loads(request.body)
#
#         try:
#             initiator_id = uuid.UUID(req_json.get('initiator', None))
#         except ValueError:
#             return HttpResponseBadRequest('Invalid initiator')
#
#         if not initiator_id or (initiator_id != current_user.id and initiator_id != friend_id):
#             return HttpResponseBadRequest('Invalid initiator')
#         initiator = User.objects.get(id=initiator_id)
#         name = req_json.get('name', None)
#         amount = Decimal(req_json.get('amount', -1))
#         loans = req_json.get('loans', {})
#
#         if not name:
#             return HttpResponseBadRequest('Invalid name')
#         if not amount or amount <= 0:
#             return HttpResponseBadRequest('Invalid amount')
#         if not loans:
#             return HttpResponseBadRequest('Invalid loans')
#         if len(loans) != 1:
#             return HttpResponseBadRequest('Invalid number of loans')
#
#         actual_loans = {}
#         total_loan_amt = Decimal(0)
#         for loan_user_id, loan_amt in loans.items():
#             try:
#                 loan_user_id = uuid.UUID(loan_user_id)
#             except ValueError:
#                 return HttpResponseBadRequest('Invalid loan user')
#             loan_amt = Decimal(loan_amt)
#             if loan_user_id == initiator.id:
#                 return HttpResponseBadRequest(
#                     'Initiator cannot receive own loan')
#             if loan_user_id != current_user.id and loan_user_id != friend_id:
#                 return HttpResponseBadRequest('Invalid loan user')
#             total_loan_amt += loan_amt
#             loan_user = User.objects.get(id=loan_user_id)
#             actual_loans[loan_user] = loan_amt
#
#         if total_loan_amt > amount:
#             return HttpResponseBadRequest(
#                 'Loan sums do not make sense with total amount')
#
#         bill = Bill.objects.update_bill(
#             old_bill, new_name=name, new_initiator=initiator,
#             new_amount=amount, new_loans=actual_loans
#         )
#         return JsonResponse(bill.to_dict_for_user(current_user))
#
#     if request.method == 'DELETE':
#         Bill.objects.delete_bill(old_bill)
#         return HttpResponse('Bill deleted')
#     return HttpResponseBadRequest('Invalid request')


@ensure_authenticated
@ensure_friends
@csrf_exempt
def friend_payments(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.get(id=friend_id)
    if request.method == 'POST':
        req_json = json.loads(request.body)
        amount = Decimal(req_json.get('amount', -1))
        if amount <= 0:
            return HttpResponseBadRequest('Invalid payment amount')
        payment = Payment.objects.create_payment(
            creator=current_user,
            amount=amount,
            receiver=friend_user
        )
        return JsonResponse(payment.to_dict())

    return HttpResponseNotFound('Invalid Request')


@ensure_authenticated
@ensure_friends
def friend_payment(request, friend_id, payment_id):
    current_user = get_user(request)
    old_payment = Payment.objects.filter(id=payment_id).first()
    if not old_payment:
        return HttpResponseBadRequest('No such payment')
    is_friend_payment = (
        set([current_user.id, friend_id])
        == set([old_payment.creator.id, old_payment.receiver.id])
    )
    if not is_friend_payment:
        return HttpResponseBadRequest('No such payment')

    if request.method == 'PUT':
        req_json = json.loads(request.body)
        amount = Decimal(req_json.get('amount', -1))
        if amount <= 0:
            return HttpResponseBadRequest('Invalid payment amount')
        new_payment = Payment.objects.update_payment(old_payment, amount)
        return JsonResponse(new_payment.to_dict())
    if request.method == 'DELETE':
        Payment.objects.delete_payment(old_payment)
        return HttpResponse('Payment deleted')

    return HttpResponseBadRequest('Invalid Request')
