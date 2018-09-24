import os
import django


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

JOHN.send_friend_request(JANE)
JANE.accept_friend_request(JOHN)

JOHN.send_friend_request(BILL)
BILL.accept_friend_request(JOHN)

TEST_GROUP.add_member(JOHN)
TEST_GROUP.add_member(BILL)
TEST_GROUP.add_member(TRUMP)

Bill.objects.create_bill(
    name='John Jane Bill',
    group=None,
    creator=JOHN,
    initiator=JOHN,
    amount=Decimal('12.34'),
    loans=dict([(JANE, Decimal('12.34'))])
)

Bill.objects.create_bill(
    name='Bill\'s Group bill',
    group=TEST_GROUP,
    creator=BILL,
    initiator=BILL,
    amount=Decimal('34.56'),
    loans=dict([(JOHN, Decimal('12.34')), (TRUMP, Decimal('22.22'))])
)

Bill.objects.create_bill(
    name='Bill\'s Group bill 2',
    group=TEST_GROUP,
    creator=BILL,
    initiator=BILL,
    amount=Decimal('54.76'),
    loans=dict([(JOHN, Decimal('32.54')), (TRUMP, Decimal('22.22'))])
)

Bill.objects.create_bill(
    name='JOHN GROUP BILL WITH BILL AND TRUMP',
    group=TEST_GROUP,
    creator=JOHN,
    initiator=JOHN,
    amount=Decimal('34.56'),
    loans=dict([(BILL, Decimal('12.34')), (TRUMP, Decimal('22.22'))])
)

Payment.objects.create_payment(
    creator=JOHN,
    amount=Decimal('12.34'),
    receiver=BILL
)

