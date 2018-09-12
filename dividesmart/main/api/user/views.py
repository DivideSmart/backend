from django.http import HttpResponse, HttpResponseNotFound, HttpResponseForbidden, JsonResponse
from django.core import serializers
from django.contrib.auth import get_user


def user(request):
    current_user = get_user(request)
    print(current_user)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    user_json = serializers.serialize(
        'json', request.user,
        fields=('email_address', 'username', 'date_joined', 'balance')
    )
    return JsonResponse(user_json, status=200)
