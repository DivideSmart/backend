from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout

from main.forms import LoginForm


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
        return HttpResponse('Invalid email or password', status=401)
    if not user.is_active:
        return HttpResponse('Inactive account', status=404)
    login(request, user)
    return HttpResponse("logged in as: %s" % user.email_address)


def handle_logout(request):
    logout(request)
    return HttpResponse("logged out")
