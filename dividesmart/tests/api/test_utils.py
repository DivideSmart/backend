from django.test import Client
from django.http.response import JsonResponse

import ujson as json


LOGIN_URL = '/api/login/'
REGISTER_URL = '/api/register/'


def jsonify(obj):
    # Super weird way to get json (dict) equivalent
    return json.loads(JsonResponse(obj).content)


def get_client_with_credentials(email, password):
    client = Client()
    client.post(LOGIN_URL, {
        'email_address': email,
        'password': password
    })
    return client
