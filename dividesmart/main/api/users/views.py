from django.http import (
    HttpResponseNotFound, HttpResponse, HttpResponseForbidden, JsonResponse
)
from django.contrib.auth import get_user
from django.views.decorators.csrf import csrf_exempt
from main.models import User
from django.forms.models import model_to_dict


def user(request):
    # Can only look at this user if you are a friend of this user
    # or you are this user
    return HttpResponseNotFound()


def other_users_to_dict(users):
    return [other_user_to_dict(u) for u in users]


def other_user_to_dict(user):
    user_json = model_to_dict(user, fields=['email_address', 'username'])
    user_json['pk'] = user.pk
    return user_json


@csrf_exempt
def friends(request, user_id):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
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
            current_user.received_friend_requests.filter(pk=user_id).first()
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
def friend(request, user_id, friend_id):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    if current_user.pk != user_id:
        return HttpResponseForbidden('Cannot modify this user\'s friends')
    if request.method == 'DELETE':
        other_user = User.objects.filter(pk=friend_id).first()
        if not other_user:
            return HttpResponseNotFound('No such friend')
        # Delete friendship / request with this user id
        current_user.received_friend_requests.remove(other_user)
        current_user.requested_friends.remove(other_user)
        current_user.friends.remove(other_user)
        current_user.save()
        other_user.save()
        return HttpResponse('Friend removed')
    return HttpResponseNotFound('Invalid request')
