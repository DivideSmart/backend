from django.contrib.auth import get_user
from django.http import (
    HttpResponseNotFound, HttpResponse, HttpResponseForbidden, JsonResponse,
    HttpResponseBadRequest
)

from main.models import (
    User, Group, Entry, Bill, Payment
)
from main.utils import (
    ensure_authenticated,
)
import ujson as json
import uuid
from django.views.decorators.csrf import csrf_exempt


def user(request):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    return JsonResponse(current_user.to_dict_for_self())


@ensure_authenticated
def friends(request):
    current_user = get_user(request)
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
        received_fr = current_user.has_friend_request(from_user_id=friend_id)
        if received_fr:
            current_user.accept_friend_request(from_user=other_user)
            return HttpResponse('Friend request accepted')
        else:
            current_user.send_friend_request(other_user)
            return HttpResponse('Friend request sent')
    return HttpResponseNotFound('Invalid request')


@ensure_authenticated
def friend(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'GET':
        return JsonResponse(
            friend_user.to_dict_for_others(
                current_user, for_group=None, show_debt=True)
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
            'invites': Group.to_dicts(current_user.group_invites.all())
        })
    if request.method == 'POST':
        return HttpResponse('nice POST')
    return HttpResponseNotFound('Invalid request')


def group(request, user_id, group_id):
    pass


@ensure_authenticated
def friend_entries(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'GET':
        # TODO: Add pagination
        entries = (
            Entry.objects
            .filter(group=None)
            .filter(participants__id=current_user.id)
            .filter(participants__id=friend_id)
            .order_by('-date_created', 'name')
            .all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user) for e in entries]
        })
    return HttpResponse()


@ensure_authenticated
def friend_bills(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'POST':
        # Changed content-type: application/json
        # Now we need to load the json object in the request
        if not request.body:
            return HttpResponseBadRequest('Invalid request')
        req_json = json.loads(request.body)

        try:
            initiator_id = uuid.UUID(req_json.get('initiator', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid initiator')

        if not initiator_id or (initiator_id != current_user.id and initiator_id != friend_id):
            return HttpResponseBadRequest('Invalid initiator')
        initiator = User.objects.get(id=initiator_id)
        name = req_json.get('name', None)
        creator = current_user
        amount = float(req_json.get('amount', -1))
        loans = req_json.get('loans', {})

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
            loan_amt = float(loan_amt)
            if loan_user_id == initiator.id:
                return HttpResponseBadRequest(
                    'Initiator cannot receive own loan')
            if loan_user_id != current_user.id and loan_user_id != friend_id:
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


@ensure_authenticated
def friend_bill(request, friend_id, bill_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')

    old_bill = Bill.objects.filter(id=bill_id).first()
    if not old_bill or old_bill.group:
        return HttpResponseBadRequest('No such bill')
    participant_ids = [p.id for p in old_bill.participants.all()]
    is_friend_bill = (
        len(participant_ids) == 2 and
        all(i in (current_user.id, friend_id) for i in participant_ids)
    )
    if not is_friend_bill:
        return HttpResponseBadRequest('No such bill')
    # TODO: Add GET?
    if request.method == 'PUT':
        # Copied from POST bill
        # Changed content-type: application/json
        # Now we need to load the json object in the request
        if not request.body:
            return HttpResponseBadRequest('Invalid request')
        req_json = json.loads(request.body)

        try:
            initiator_id = uuid.UUID(req_json.get('initiator', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid initiator')

        if not initiator_id or (initiator_id != current_user.id and initiator_id != friend_id):
            return HttpResponseBadRequest('Invalid initiator')
        initiator = User.objects.get(id=initiator_id)
        name = req_json.get('name', None)
        amount = float(req_json.get('amount', -1))
        loans = req_json.get('loans', {})

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
            loan_amt = float(loan_amt)
            if loan_user_id == initiator.id:
                return HttpResponseBadRequest(
                    'Initiator cannot receive own loan')
            if loan_user_id != current_user.id and loan_user_id != friend_id:
                return HttpResponseBadRequest('Invalid loan user')
            total_loan_amt += loan_amt
            loan_user = User.objects.get(id=loan_user_id)
            actual_loans[loan_user] = loan_amt

        if total_loan_amt > amount:
            return HttpResponseBadRequest(
                'Loan sums do not make sense with total amount')

        bill = Bill.objects.update_bill(
            old_bill, new_name=name, new_initiator=initiator,
            new_amount=amount, new_loans=actual_loans
        )
        return JsonResponse(bill.to_dict_for_user(current_user))

    if request.method == 'DELETE':
        Bill.objects.delete_bill(old_bill)
        return HttpResponse('Bill deleted')
    return HttpResponseBadRequest('Invalid request')


@ensure_authenticated
@csrf_exempt
def friend_payments(request, friend_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')
    if request.method == 'POST':
        req_json = json.loads(request.body)
        amount = float(req_json.get('amount', -1))
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


@ensure_authenticated
def friend_payment(request, friend_id, payment_id):
    current_user = get_user(request)
    friend_user = current_user.friends.filter(id=friend_id).first()
    if not friend_user:
        return HttpResponseNotFound('No such friend')

    old_payment = Payment.objects.filter(id=payment_id).first()
    if not old_payment or old_payment.group:
        return HttpResponseBadRequest('No such payment')
    is_friend_payment = all(
        [p.id in (current_user.id, friend_id) for p in
         [old_payment.creator, old_payment.receiver]]
    )
    if not is_friend_payment:
        return HttpResponseBadRequest('No such payment')

    if request.method == 'PUT':
        req_json = json.loads(request.body)
        amount = float(req_json.get('amount', -1))
        if amount <= 0:
            return HttpResponseBadRequest('Invalid payment amount')
        new_payment = Payment.objects.update_payment(old_payment, amount)
        return JsonResponse(new_payment.to_dict())
    if request.method == 'DELETE':
        Payment.objects.delete_payment(old_payment)
        return HttpResponse('Payment deleted')

    return HttpResponseBadRequest('Invalid Request')
