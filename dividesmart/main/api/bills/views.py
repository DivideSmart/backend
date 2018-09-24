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
from decimal import Decimal


@ensure_authenticated
def bills(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Invalid request')

    current_user = get_user(request)
    if not request.body:
        return HttpResponseBadRequest('Invalid request')
    req_json = json.loads(request.body)
    try:
        initiator_id = uuid.UUID(req_json.get('initiator', None))
        req_group_id = req_json.get('group_id', None)
        group_id = uuid.UUID(req_group_id) if req_group_id else None
    except TypeError:
        return HttpResponseBadRequest('Invalid request')

    initiator = User.objects.filter(id=initiator_id).first()
    if not initiator:
        return HttpResponseBadRequest('Invalid Initiator')
    name = req_json.get('name', None)
    creator = current_user
    amount = Decimal(req_json.get('amount', -1))
    loans = req_json.get('loans', {})

    group = current_user.joined_groups.filter(id=group_id).first()
    if group_id and not group:
        return HttpResponseBadRequest('Invalid group')

    must_be_in_set = set([str(m.id) for m in group.users.all()]) \
        if group else set([str(f.id) for f in current_user.friends.all()]
                          + [str(current_user.id)])

    users_involved = [str(initiator_id)]
    users_involved.extend(loans.keys())

    # import pdb; pdb.set_trace()

    for u in users_involved:
        if u not in must_be_in_set:
            return HttpResponseBadRequest('Invalid user involved in bill')

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
        # if loan_user_id not in must_be_in_set:
        #     return HttpResponseBadRequest('Invalid loan user involved')
        loan_amt = Decimal(loan_amt)
        total_loan_amt += loan_amt
        loan_user = User.objects.get(id=loan_user_id)
        actual_loans[loan_user] = loan_amt

    if total_loan_amt > amount:
        return HttpResponseBadRequest(
            'Loan sums do not make sense with total amount')

    # import pdb; pdb.set_trace()
    bill = Bill.objects.create_bill(
        name, group, creator, initiator, amount, actual_loans
    )
    return JsonResponse(bill.to_dict_for_user(current_user))


@ensure_authenticated
def bill(request, bill_id):
    current_user = get_user(request)

    old_bill = Bill.objects.filter(id=bill_id).first()
    if not old_bill:
        return HttpResponseBadRequest('Invalid bill')

    if not old_bill.participants.filter(id=current_user.id).exists():
        return HttpResponseBadRequest('Not authorized to view bill')

    # if request.method == 'PUT':
    #     # Copied from POST bill
    #     # Changed content-type: application/json
    #     # Now we need to load the json object in the request
    #     if not request.body:
    #         return HttpResponseBadRequest('Invalid request')
    #     req_json = json.loads(request.body)
    #     group_member_ids = set(m.id for m in group.users.all())
    #     try:
    #         initiator_id = uuid.UUID(req_json.get('initiator', None))
    #     except ValueError:
    #         return HttpResponseBadRequest('Invalid initiator')
    #
    #     if not initiator_id or initiator_id not in group_member_ids:
    #         return HttpResponseBadRequest('Invalid initiator')
    #     initiator = User.objects.get(id=initiator_id)
    #     name = req_json.get('name', None)
    #     amount = Decimal(req_json.get('amount', -1))
    #     loans = req_json.get('loans', {})
    #
    #     if not name:
    #         return HttpResponseBadRequest('Invalid name')
    #     if not amount or amount <= 0:
    #         return HttpResponseBadRequest('Invalid amount')
    #     if not loans:
    #         return HttpResponseBadRequest('Invalid loans')
    #
    #     actual_loans = {}
    #     total_loan_amt = 0
    #     for loan_user_id, loan_amt in loans.items():
    #         try:
    #             loan_user_id = uuid.UUID(loan_user_id)
    #         except ValueError:
    #             return HttpResponseBadRequest('Invalid loan user id')
    #         if loan_user_id == initiator.id:
    #             return HttpResponseBadRequest(
    #                 'Initiator cannot receive own loan')
    #         if loan_user_id not in group_member_ids:
    #             return HttpResponseBadRequest(
    #                 'Invalid loan user not in group')
    #         loan_amt = Decimal(loan_amt)
    #         total_loan_amt += loan_amt
    #         loan_user = User.objects.get(id=loan_user_id)
    #         actual_loans[loan_user] = loan_amt
    #
    #     if total_loan_amt > amount:
    #         return HttpResponseBadRequest(
    #             'Loan sums do not make sense with total amount')
    #
    #     bill = Bill.objects.update_bill(
    #         old_bill, new_name=name,
    #         new_initiator=initiator, new_amount=amount,
    #         new_loans=actual_loans
    #     )
    #     return JsonResponse(bill.to_dict_for_user(current_user))
    if request.method == 'DELETE':
        Bill.objects.delete_bill(old_bill)
        return HttpResponse('Bill deleted')
    return HttpResponseBadRequest('Invalid request')
