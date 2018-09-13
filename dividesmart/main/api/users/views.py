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
def friends(request, id):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    if request.method == 'GET':
        # GET all friends for this user id
        # user must be this user id
        if current_user.pk != id:
            return HttpResponseForbidden('Cannot view this user\'s friends')
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

    if current_user.pk == id:
        return HttpResponseNotFound('Cannot modify friendship with yourself')
    other_user = User.objects.filter(pk=id).first()
    if not other_user:
        return HttpResponseNotFound('No such user')
    if request.method == 'POST':
        # Request friendship with this user id
        # Or accept friendship with this user id
        received_fr = (
            current_user.received_friend_requests.filter(pk=id).first()
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
    if request.method == 'DELETE':
        # Delete friendship / request with this user id
        pass
    current_user.save()
    other_user.save()
    return HttpResponse(request.path)
