from django.contrib.auth import get_user
from django.core import serializers
from django.http import (HttpResponse, HttpResponseForbidden,
                         HttpResponseNotFound, JsonResponse)
from django.views.decorators.csrf import csrf_exempt


def user(request):
    current_user = get_user(request)
    print(current_user)
    if not current_user.is_authenticated:
        print('test')
        return HttpResponseForbidden('Not logged in')
    # user_json = serializers.serialize(
    #     'json', request.user,
    #     fields=('email_address', 'username', 'date_joined', 'balance')
    # )
    user_json = {}
    return JsonResponse(user_json, status=200)
