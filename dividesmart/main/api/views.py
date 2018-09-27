import facebook
import requests
from django.contrib.auth import authenticate, login, logout
from django.http import (HttpResponse, HttpResponseBadRequest,
                         HttpResponseNotFound, JsonResponse)
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport import requests as gauth_requests
from google.oauth2 import id_token

import ujson as json
from main.forms import LoginForm, RegistrationForm
from main.models import User


@csrf_exempt
def handle_fb_login(request):
    if request.method != 'POST':
        return HttpResponseNotFound('Invalid request')

    try:
        req_json = json.loads(request.body)
        graph = facebook.GraphAPI(access_token=req_json['accessToken'], version=2.8)
        user_response = graph.get_object(id=req_json['userID'], fields='email,picture,name')
        email = user_response['email']
        name = user_response['name']
        portrait_url = user_response['picture']['data']['url']

        if not User.objects.filter(email_address=email).exists():
            new_user = User()
            new_user.username = name
            new_user.email_address = email
            new_user.external_avatar_url = portrait_url
            new_user.save()
        user = User.objects.filter(email_address=email).first()
        user.username = name
        user.external_avatar_url = portrait_url
        user.save()

        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        return HttpResponse(status=200)
    except Exception:
        return HttpResponse("Facebook login fail", status=400)


@csrf_exempt
def handle_google_login(request):
    try:
        req_json = json.loads(request.body)
        input_token = str(req_json['id_token'])

        # TODO: do not hardcode client ID, put it into private_settings.py and import from settings
        userinfo = id_token.verify_oauth2_token(
            input_token, gauth_requests.Request(),
            "656759793501-95m29dhgik9us1k2hk9ucfqnm5b96rmh.apps.googleusercontent.com"
        )
        if userinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise Exception('Wrong issuer.')
        if 'error_description' in userinfo:
            raise Exception('Wrong ID token.')
        if 'email_verified' not in userinfo or not userinfo['email_verified']:
            raise Exception('Wrong email.')

        if not User.objects.filter(email_address=userinfo['email']).exists():
            new_user = User()
            new_user.username = userinfo['name']
            new_user.email_address = userinfo['email']
            new_user.external_avatar_url = userinfo['picture']
            new_user.save()

        user = User.objects.get(email_address=userinfo['email'])
        user.username = userinfo['name']
        user.external_avatar_url = userinfo['picture']
        user.save()

        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        return HttpResponse(status=200)
    except Exception:
        return HttpResponse("Google login fail", status=400)


@csrf_exempt
def handle_login(request):
    if request.method != 'POST':
        return HttpResponseNotFound('Invalid request')

    req_json = json.loads(request.body)
    user = authenticate(
        email_address=req_json['emailAddress'],
        password=req_json['password']
    )

    if not user:
        return HttpResponseBadRequest('Invalid email or password')
    if not user.is_active:
        return HttpResponse('Inactive account', status=404)
    login(request, user)
    return HttpResponse("logged in as: %s" % user.email_address)


def handle_register(request):
    # TODO: Add email confirmation later
    req_json = json.loads(request.body)
    form = RegistrationForm(req_json)
    is_successful = False
    if form.is_valid():
        is_successful = True
        User.objects.create_user(
            username=form.cleaned_data['username'],
            email_address=form.cleaned_data['emailAddress'],
            password=form.cleaned_data['password']
        )
    return JsonResponse({
        'success': is_successful,
        'errors': json.loads(form.errors.as_json())
    })


def handle_logout(request):
    logout(request)
    return HttpResponse("logged out")
