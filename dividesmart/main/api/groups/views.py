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
    Group, User
)
from django.contrib.auth import get_user


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


def group(request, id):
    return HttpResponse(request.path)


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
        'members': other_users_to_dict(group.users.all())
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
            'invites': other_users_to_dict(group.invited_users.all())
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
        return HttpResponse('Invite deleted')
    return HttpResponseNotFound('Invalid request')
