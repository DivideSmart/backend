from django.contrib.auth import get_user
from functools import wraps
from django.http import (
    HttpResponseForbidden
)


def ensure_authenticated(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        request = args[0]
        current_user = get_user(request)
        if not current_user.is_authenticated:
            return HttpResponseForbidden('Not logged in')
        return f(*args, **kwargs)
    return wrapper
