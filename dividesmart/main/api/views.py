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

@csrf_exempt
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
        return HttpResponseBadRequest('Invalid email or password')
    if not user.is_active:
        return HttpResponse('Inactive account', status=404)
    login(request, user)
    return HttpResponse("logged in as: %s" % user.email_address)


def handle_register(request):
    # TODO: Add email confirmation later
    form = RegistrationForm(request.POST)
    is_successful = False
    if form.is_valid():
        is_successful = True
        User.objects.create_user(
            username=form.cleaned_data['username'],
            email_address=form.cleaned_data['email_address'],
            password=form.cleaned_data['password']
        )
    return JsonResponse({
        'success': is_successful,
        'errors': json.loads(form.errors.as_json())
    })


def handle_logout(request):
    logout(request)
    return HttpResponse("logged out")
