from django.http import (
    HttpResponse, HttpResponseNotFound, HttpResponseBadRequest,
    HttpResponseForbidden, JsonResponse
)
from django.views.decorators.csrf import csrf_exempt
from main.utils import (
    ensure_authenticated, other_users_to_dict
)
from main.forms import CreateGroupForm
from main.models import Group
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


def group_invites(request, group_id):
    pass
