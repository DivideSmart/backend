import os
import django

from collections import namedtuple

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE', 'dividesmart.settings'
)
django.setup()

from main.models import *  # noqa

UserT = namedtuple('UserT', ['username', 'email_address', 'password'])

USERS = [
    UserT(
        username='John Smith',
        email_address='johnsmith@gmail.com',
        password='johnsmith123'
    ),
    UserT(
        username='Jane Doe',
        email_address='janedoe@gmail.com',
        password='janedoe94'
    ),
    UserT(
        username='Bill Gates',
        email_address='billgates@outlook.com',
        password='bgates'
    )
]

for user in USERS:
    User.objects.create_user(
        username=user.username,
        email_address=user.email_address,
        password=user.password
    )
