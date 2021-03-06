import uuid

import ujson as json
from django.contrib.auth import get_user
from django.http import (
    HttpResponse, HttpResponseNotFound, HttpResponseBadRequest,
    HttpResponseForbidden, JsonResponse
)
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal

from main.forms import CreateGroupForm
from main.models import (
    Group, User, Bill,
)
from main.utils import (
    ensure_authenticated
)


@ensure_authenticated
def groups(request):
    if request.method == 'POST':
        current_user = get_user(request)
        req_json = json.loads(request.body)
        name = req_json.get('name', '')
        if not name:
            return HttpResponseBadRequest('Invalid name')
        invited_members_ids = req_json.get('members', [])
        if type(invited_members_ids) is not list:
            return HttpResponseBadRequest('Invalid members')

        invited_members = []
        for member_id in invited_members_ids:
            try:
                invited_user_id = uuid.UUID(member_id)
            except ValueError:
                return HttpResponseBadRequest('Invalid member id')
            invited_friend = current_user.friends.filter(id=invited_user_id).first()
            if not invited_friend:
                continue
            invited_members.append(invited_friend)

        Group.objects.create_group(name, current_user, invited_members)
        return HttpResponse('group created')
    return HttpResponseNotFound('Invalid request')


@ensure_authenticated
def group(request, group_id):
    if request.method != 'GET':
        return HttpResponseNotFound('Invalid Request')
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    return JsonResponse(group.to_dict())


@ensure_authenticated
def group_members(request, group_id):
    current_user = get_user(request)
    # must be a member of this group to view other members
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'GET':
        return JsonResponse({
            'members': User.to_dicts_for_others(
                users=group.users.all(), for_user=current_user,
                show_debt=False
            )
        })

    if request.method == 'POST':
        # Invite a new user
        req_json = json.loads(request.body)
        print("RES FORM")
        ids = req_json.get('ids')

        for id in ids:
            try:
                invited_user_id = uuid.UUID(id)
            except ValueError:
                return HttpResponseBadRequest('Invalid user id')

            invited_friend = current_user.friends.filter(id=invited_user_id).first()
            # if not invited_friend:
            #     return HttpResponseNotFound('Invalid user id')
            group.add_member(invited_friend)
            print("Just ADD")
            print(invited_friend)
            return HttpResponse('user invited')

        return HttpResponseNotFound('Invalid request')


@ensure_authenticated
def group_entries(request, group_id):
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'GET':
        # TODO: Add pagination
        entries = (
            Bill.objects.filter(group=group).order_by('-date_created').all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user, None, True) for e in entries]
        })
    return HttpResponse()

@ensure_authenticated
def view_bill(request, group_id, bill_id):
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    if request.method == 'GET':
        entries = (
            Bill.objects.filter(group=group, id=bill_id).all()
        )
        return JsonResponse({
            'entries': [e.to_dict_for_user(current_user, None, True) for e in entries]
        })
    return HttpResponse()



# @ensure_authenticated
# def group_bills(request, group_id):
#     current_user = get_user(request)
#     group = Group.objects.filter(id=group_id).first()
#     if not group or not group.has_member(current_user):
#         return HttpResponseForbidden('Unauthorized to view this group')
#     if request.method == 'POST':
#
#         # Changed content-type: application/json
#         # Now we need to load the json object in the request
#         if not request.body:
#             return HttpResponseBadRequest('Invalid request')
#         req_json = json.loads(request.body)
#         group_member_ids = set(m.id for m in group.users.all())
#         try:
#             initiator_id = uuid.UUID(req_json.get('initiator', None))
#         except ValueError:
#             return HttpResponseBadRequest('Invalid initiator')
#
#         if not initiator_id or initiator_id not in group_member_ids:
#             return HttpResponseBadRequest('Invalid initiator')
#         initiator = User.objects.get(id=initiator_id)
#         name = req_json.get('name', None)
#         creator = current_user
#         amount = Decimal(req_json.get('amount', -1))
#         loans = req_json.get('loans', {})
#
#         if not name:
#             return HttpResponseBadRequest('Invalid name')
#         if not amount or amount <= 0:
#             return HttpResponseBadRequest('Invalid amount')
#         if not loans:
#             return HttpResponseBadRequest('Invalid loans')
#
#         actual_loans = {}
#         total_loan_amt = 0
#         for loan_user_id, loan_amt in loans.items():
#             try:
#                 loan_user_id = uuid.UUID(loan_user_id)
#             except ValueError:
#                 return HttpResponseBadRequest('Invalid loan user id')
#             if loan_user_id == initiator.id:
#                 return HttpResponseBadRequest(
#                     'Initiator cannot receive own loan')
#             if loan_user_id not in group_member_ids:
#                 return HttpResponseBadRequest('Invalid loan user not in group')
#             loan_amt = Decimal(loan_amt)
#             total_loan_amt += loan_amt
#             loan_user = User.objects.get(id=loan_user_id)
#             actual_loans[loan_user] = loan_amt
#
#         if total_loan_amt > amount:
#             return HttpResponseBadRequest(
#                 'Loan sums do not make sense with total amount')
#
#         # import pdb; pdb.set_trace()
#         bill = Bill.objects.create_bill(
#             name, group, creator, initiator, amount, actual_loans
#         )
#         return JsonResponse(bill.to_dict_for_user(current_user))
#     return HttpResponseNotFound('Invalid Request')


@ensure_authenticated
def group_bill(request, group_id, bill_id):
    current_user = get_user(request)
    group = Group.objects.filter(id=group_id).first()
    if not group or not group.has_member(current_user):
        return HttpResponseForbidden('Unauthorized to view this group')
    old_bill = Bill.objects.filter(id=bill_id, group=group).first()
    if not old_bill:
        return HttpResponseBadRequest('Invalid bill')

    # TODO: Maybe we have GET here?
    if request.method == 'PUT':
        # Copied from POST bill
        # Changed content-type: application/json
        # Now we need to load the json object in the request
        if not request.body:
            return HttpResponseBadRequest('Invalid request')
        req_json = json.loads(request.body)
        group_member_ids = set(m.id for m in group.users.all())
        try:
            initiator_id = uuid.UUID(req_json.get('initiator', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid initiator')

        if not initiator_id or initiator_id not in group_member_ids:
            return HttpResponseBadRequest('Invalid initiator')
        initiator = User.objects.get(id=initiator_id)
        name = req_json.get('name', None)
        amount = Decimal(req_json.get('amount', -1))
        loans = req_json.get('loans', {})

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
                return HttpResponseBadRequest(
                    'Invalid loan user not in group')
            loan_amt = Decimal(loan_amt)
            total_loan_amt += loan_amt
            loan_user = User.objects.get(id=loan_user_id)
            actual_loans[loan_user] = loan_amt

        if total_loan_amt > amount:
            return HttpResponseBadRequest(
                'Loan sums do not make sense with total amount')

        bill = Bill.objects.update_bill(
            old_bill, new_name=name,
            new_initiator=initiator, new_amount=amount,
            new_loans=actual_loans
        )
        return JsonResponse(bill.to_dict_for_user(current_user))
    if request.method == 'DELETE':
        Bill.objects.delete_bill(old_bill)
        return HttpResponse('Bill deleted')
    return HttpResponseBadRequest('Invalid request')
