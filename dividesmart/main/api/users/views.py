from django.contrib.auth import get_user
from django.http import HttpResponseForbidden, JsonResponse

from main.models import Group, User
from main.utils import ensure_authenticated


@ensure_authenticated
def user(request, user_id):
    # Can only look at this user if you are a friend of this user
    # or you are this user, or you are in the same group as this user
    if request.method != 'GET':
        # TODO: Unless you are this user?
        return HttpResponseForbidden('Cannot modify this user')
    current_user = get_user(request)
    is_related = (current_user.id == user_id) \
                 or (current_user.friends.filter(id=user_id).exists()) \
                 or (
                    Group.objects
                    .filter(users__id=user_id)
                    .filter(users__id=current_user.id)
                    .exists()
                 )
    if not is_related:
        return HttpResponseForbidden('Cannot view this user')
    other_user = User.objects.get(id=user_id)
    return JsonResponse(other_user.to_dict_for_others(current_user))
