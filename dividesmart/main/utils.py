from django.contrib.auth import get_user
from functools import wraps
from django.http import (
    HttpResponseForbidden
)
from django.forms.models import model_to_dict
from main.models import Debt


def ensure_authenticated(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        request = args[0]
        current_user = get_user(request)
        if not current_user.is_authenticated:
            return HttpResponseForbidden('Not logged in')
        return f(*args, **kwargs)
    return wrapper


def other_users_to_dict(other_users, current_user, show_debt, group=None):
    return [other_user_to_dict(
        u, current_user, show_debt, group) for u in other_users]


def other_user_to_dict(other_user, current_user, show_debt, group=None):
    user_json = model_to_dict(other_user, fields=['email_address', 'username'])
    user_json['id'] = other_user.id
    if show_debt:
        if current_user.id != other_user.id:
            debt = Debt.objects.filter(
                user=current_user, other_user=other_user, group=group
            ).first()
            user_json['debt'] = debt.amount if debt else -9999999
    return user_json
