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
    Group, User, Bill,
)
from main.utils import (
    ensure_authenticated
)


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
        try:
            invited_user_id = uuid.UUID(req_json.get('userId', None))
        except ValueError:
            return HttpResponseBadRequest('Invalid user id')

        invited_friend = current_user.friends.filter(id=invited_user_id).first()
        if not invited_friend:
            return HttpResponseNotFound('Invalid user id')
        group.add_member(invited_friend)
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
