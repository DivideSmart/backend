from django.http import (
    HttpResponse, HttpResponseNotFound, HttpResponseBadRequest, JsonResponse
)
from django.contrib.auth import (
    authenticate, login, logout
)
from main.forms import (
    LoginForm, RegistrationForm
)
from main.models import User
from django.views.decorators.csrf import csrf_exempt
import ujson as json


def handle_login(request):
    if request.method != 'POST':
        return HttpResponseNotFound('Invalid request')
    form = LoginForm(request.POST)
    if not form.is_valid():
        return HttpResponseNotFound('Invalid request')
    user = authenticate(
        email_address=form.cleaned_data['email_address'],
        password=form.cleaned_data['password']
    )
    if not user:
        return HttpResponse('Invalid email or password', status=401)
    if not user.is_active:
        return HttpResponse('Inactive account', status=404)
    login(request, user)
    return HttpResponse("logged in as: %s" % user.email_address)


@csrf_exempt
def handle_register(request):
    # TODO: Add email confirmation later
    form = RegistrationForm(request.POST)
    is_successful = False
    if form.is_valid():
        is_successful = False
        User.objects.create_user(
            username=form.cleaned_data['username'],
            email_address=form.cleaned_data['email_address'],
            password=form.cleaned_data['password']
        )
    return JsonResponse({
        'success': is_successful,
        'errors': json.loads(form.errors.as_json())
    }, status=400)


def handle_logout(request):
    logout(request)
    return HttpResponse("logged out")
