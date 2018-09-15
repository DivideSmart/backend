import os
import django

from collections import namedtuple

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE', 'dividesmart.settings'
)
django.setup()

from main.models import *  # noqa

JOHN = User.objects.create_user(
    username='John Smith',
    email_address='johnsmith@gmail.com',
    password='johnsmith123'
)

JANE = User.objects.create_user(
    username='Jane Doe',
    email_address='janedoe@gmail.com',
    password='janedoe94'
)

BILL = User.objects.create_user(
    username='Bill Gates',
    email_address='billgates@outlook.com',
    password='bgates'
)

TEST_GROUP = Group.objects.create_group(
    name='Test Group',
    user=JOHN
)

JOHN.friends.add(JANE)
JOHN.requested_friends.add(BILL)
TEST_GROUP.users.add(JOHN)
TEST_GROUP.invited_users.add(JANE)
TEST_GROUP.users.add(BILL)
