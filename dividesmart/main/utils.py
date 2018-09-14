from django.contrib.auth import get_user
from functools import wraps
from django.http import (
    HttpResponseForbidden
)
from django.forms.models import model_to_dict


def ensure_authenticated(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        request = args[0]
        current_user = get_user(request)
        if not current_user.is_authenticated:
            return HttpResponseForbidden('Not logged in')
        return f(*args, **kwargs)
    return wrapper


def other_users_to_dict(users):
    return [other_user_to_dict(u) for u in users]


def other_user_to_dict(user):
    user_json = model_to_dict(user, fields=['email_address', 'username'])
    user_json['pk'] = user.pk
    return user_json
