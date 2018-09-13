from django.contrib.auth import get_user
from django.http import (
    HttpResponseForbidden, JsonResponse
)
from django.forms.models import model_to_dict


def user(request):
    current_user = get_user(request)
    if not current_user.is_authenticated:
        return HttpResponseForbidden('Not logged in')
    user_json = model_to_dict(
        current_user,
        fields=('email_address', 'username', 'date_joined', 'balance')
    )
    user_json['pk'] = current_user.pk
    return JsonResponse(user_json, status=200)
