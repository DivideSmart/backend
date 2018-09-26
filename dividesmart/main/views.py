from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.core.mail import \
    EmailMessage  # for sending verification using e-mail
from django.http import HttpResponse
from django.shortcuts import render

from main.forms import LoginForm, RegistrationForm
from main.models import User
import requests
from django.shortcuts import redirect

def register(request):
    # TODO: Add email confirmation later
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            User.objects.create_user(
                username=form.cleaned_data['username'],
                email_address=form.cleaned_data['email_address'],
                password=form.cleaned_data['password']
            )
            return HttpResponse('user created')
    else:
        form = RegistrationForm()
    return render(request, 'main/register.html', {'form': form})


def service_worker(request):
    content = requests.get(request.scheme + '://' + request.META['HTTP_HOST'] + '/static/service-worker.js').text
    response = HttpResponse(content, content_type='application/javascript')
    return response


def display_login(request):
    form = LoginForm()
    return render(request, 'main/login.html', {'form': form})


def display_index(request):
    if isinstance(request.user, AnonymousUser):
        return redirect('/login/')
    return render(request, 'main/index.html')


def display_form(request):
    return render(request, 'main/form.html')


def display_qr_scanner(request):
    return render(request, 'main/qr_scanner.html')

def display_qr_code(request):
    return render(request, 'main/qr_code.html')


def display_new_user(request, pk):
    return render(request, 'main/user.html')
