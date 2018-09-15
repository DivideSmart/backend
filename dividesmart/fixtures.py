import os
import django

from collections import namedtuple

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE', 'dividesmart.settings'
)
django.setup()

from main.models import *  # noqa

User.objects.create_superuser(
    email_address='a@a.com',
    username='a',
    password='a'
)

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

TRUMP = User.objects.create_user(
    username='Donald Trump',
    email_address='realdonaldtrump@gmail.com',
    password='djt'
)

TEST_GROUP = Group.objects.create_group(name='Test Group', user=JOHN)

JOHN.friends.add(JANE)
JOHN_JANE_DEBT = Debt.objects.create(user=JOHN, other_user=JANE)
JANE_JOHN_DEBT = Debt.objects.create(user=JANE, other_user=JOHN)

JOHN.requested_friends.add(BILL)
TEST_GROUP.users.add(JOHN)

TEST_GROUP.users.add(BILL)
TEST_GROUP_JOHN_BILL_DEBT = Debt.objects.create(
    group=TEST_GROUP, user=JOHN, other_user=BILL
)
TEST_GROUP_BILL_JOHN_DEBT = Debt.objects.create(
    group=TEST_GROUP, user=BILL, other_user=JOHN
)

TEST_GROUP.users.add(TRUMP)
TEST_GROUP_JOHN_TRUMP_DEBT = Debt.objects.create(
    group=TEST_GROUP, user=JOHN, other_user=TRUMP
)
TEST_GROUP_TRUMP_JOHN_DEBT = Debt.objects.create(
    group=TEST_GROUP, user=TRUMP, other_user=JOHN
)
TEST_GROUP_BILL_TRUMP_DEBT = Debt.objects.create(
    group=TEST_GROUP, user=BILL, other_user=TRUMP
)
TEST_GROUP_TRUMP_BILL_DEBT = Debt.objects.create(
    group=TEST_GROUP, user=TRUMP, other_user=BILL
)

TEST_GROUP.invited_users.add(JANE)

Bill.objects.create_bill(
    name='Test bill',
    group=None,
    creator=JOHN,
    initiator=JOHN,
    amount=12.34,
    loans=dict([(JANE, 12.34)])
)

Bill.objects.create_bill(
    name='Bill\'s bill',
    group=TEST_GROUP,
    creator=BILL,
    initiator=BILL,
    amount=34.56,
    loans=dict([(JOHN, 12.34), (TRUMP, 22.22)])
)
