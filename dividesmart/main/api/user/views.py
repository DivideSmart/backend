from django.contrib.auth import get_user
from django.http import (
    HttpResponseForbidden, JsonResponse
)


def user(request):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    return JsonResponse(current_user.to_dict_for_self())
