from django.http import (
    HttpResponseNotFound, HttpResponse, HttpResponseForbidden, JsonResponse
)
from django.contrib.auth import get_user
from django.views.decorators.csrf import csrf_exempt
from main.models import (
    User, Payment, Loan, Group
)
from django.forms.models import model_to_dict
from django.db.models import Q
from main.utils import ensure_authenticated


def other_users_to_dict(users):
    return [other_user_to_dict(u) for u in users]


def other_user_to_dict(user):
    user_json = model_to_dict(user, fields=['email_address', 'username'])
    user_json['pk'] = user.pk
    return user_json


def groups_to_dict(groups):
    return [group_to_dict(g) for g in groups]


def group_to_dict(group):
    group_json = model_to_dict(group, fields=['name', 'date_created', 'creator'])
    group_json['pk'] = group.pk
    return group_json


@ensure_authenticated
def user(request, user_id):
    # Can only look at this user if you are a friend of this user
    # or you are this user, or you are in the same group as this user
    if request.method != 'GET':
        # TODO: Unless you are this user?
        return HttpResponseForbidden('Cannot modify this user')
    current_user = get_user(request)
    is_related = (current_user.pk == user_id) \
                 or (current_user.friends.filter(pk=user_id).first() is not None) \
                 or (
                     Group.objects.filter(
                         Q(users=current_user) & Q(users=user_id)
                     ).first() is not None)
    if not is_related:
        return HttpResponseForbidden('Cannot view this user')
    other_user = User.objects.filter(pk=user_id).first()
    return JsonResponse(other_user_to_dict(other_user))


@csrf_exempt
@ensure_authenticated
def friends(request, user_id):
    current_user = get_user(request)
    if current_user.pk != user_id:
        return HttpResponseForbidden('Cannot view this user\'s friends')
    if request.method == 'GET':
        return JsonResponse({
            'friends': other_users_to_dict(current_user.friends.all()),
            'invites': {
                'sent': other_users_to_dict(
                    current_user.requested_friends.all()
                ),
                'received': other_users_to_dict(
                    current_user.received_friend_requests.all()
                )
            }
        })

    if request.method == 'POST':
        # Request friendship with this user id
        # Or accept friendship with this user id
        friend_id = request.POST.get('friend_id', None)
        other_user = User.objects.filter(pk=friend_id).first()
        if not other_user:
            return HttpResponseNotFound('No such user')
        received_fr = (
            current_user.received_friend_requests.filter(pk=friend_id).first()
        )
        if received_fr:
            current_user.received_friend_requests.remove(other_user)
            current_user.friends.add(other_user)
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
    if current_user.pk != user_id:
        return HttpResponseForbidden('Cannot modify this user\'s friends')
    if request.method == 'DELETE':
        friend_user = User.objects.filter(pk=friend_id).first()
        if not friend_user:
            return HttpResponseNotFound('No such friend')
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
    if current_user.pk != user_id:
        return HttpResponseForbidden('Cannot view this user\'s groups')
    if request.method == 'GET':
        # get all groups for this user
        groups = current_user.group_set.all()
        return JsonResponse({
            'groups': groups_to_dict(groups)
        })
    if request.method == 'POST':
        # join a group
        return HttpResponse('nice POST')
    return HttpResponseNotFound('Invalid request')


def group(request, user_id, group_id):
    pass


@csrf_exempt
@ensure_authenticated
def friend_entries(request, user_id, friend_id):
    current_user = get_user(request)
    if current_user.pk != user_id:
        return HttpResponseForbidden('Cannot modify this user')
    if request.method == 'GET':
        # TODO: Add pagination
        friend_user = User.objects.filter(pk=friend_id).first()
        if not friend_user:
            return HttpResponseNotFound('No such friend')
    return HttpResponse()


@csrf_exempt
@ensure_authenticated
def friend_bills(request, user_id, friend_id):
    # TODO: Remember to extract this functionality so
    # that it can be reused in groups
    return HttpResponse()


@csrf_exempt
@ensure_authenticated
def friend_payments(request, user_id, friend_id):
    return HttpResponse()
