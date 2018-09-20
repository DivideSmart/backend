from django.test import TestCase, Client
from main.models import (
    User, Group, Bill, Payment
)
from tests.api.test_utils import LOGIN_URL
from django.http.response import JsonResponse
import ujson as json


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


class GroupTest(TestCase):

    GROUP_URL = '/api/groups/%s/'
    GROUP_MEMBERS_URL = '/api/groups/%s/members/'
    GROUP_INVITES_URL = '/api/groups/%s/invites/'

    @classmethod
    def setUpTestData(cls):
        cls.JOHN = User.objects.create_user(
            'John Smith', 'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE = User.objects.create_user(
            'Jane Doe', 'janedoe@gmail.com', 'janedoe94'
        )
        cls.TRUMP = User.objects.create_user(
            'Donald Trump', 'realdonaldtrump@gmail.com', 'djt'
        )
        cls.JOHNS_GROUP = Group.objects.create_group('John\'s Group', cls.JOHN)
        cls.JOHNS_GROUP.invited_users.add(cls.TRUMP)
        cls.JOHNS_GROUP.add_member(cls.TRUMP)

        cls.JOHN_CLIENT = get_client_with_credentials(
            'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE_CLIENT = get_client_with_credentials(
            'janedoe@gmail.com', 'janedoe94'
        )
        cls.TRUMP_CLIENT = get_client_with_credentials(
            'realdonaldtrump@gmail.com', 'djt'
        )
        cls.JOHNS_GROUP_URL = cls.GROUP_URL % str(cls.JOHNS_GROUP.id)
        cls.JOHNS_GROUP_MEMBERS_URL = (
            cls.GROUP_MEMBERS_URL % str(cls.JOHNS_GROUP.id)
        )
        cls.JOHNS_GROUP_INVITES_URL = (
            cls.GROUP_INVITES_URL % str(cls.JOHNS_GROUP.id)
        )

    def test_get_group(self):
        # John can get his group
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_URL)
        assert response.status_code == 200

        # Jane can't get John's group
        response = self.JANE_CLIENT.get(self.JOHNS_GROUP_URL)
        assert response.status_code == 403

    def test_get_group_members(self):
        # John can get his group members
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 2
        dicts = User.to_dicts_for_others(
            [self.JOHN, self.TRUMP], self.JOHN,
            for_group=self.JOHNS_GROUP, show_debt=True
        )
        assert res_json['members'] == [jsonify(m) for m in dicts]

        # Jane can't get that group's members
        response = self.JANE_CLIENT.get(self.JOHNS_GROUP_MEMBERS_URL)
        assert response.status_code == 403

    def test_get_group_invited_users(self):
        # John can get his group invited users
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['invites']) == 0

        # Jane can't get the group invited users
        response = self.JANE_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        assert response.status_code == 403

    def test_invite_user_to_group(self):
        # Jane can't invite anyone
        response = self.JANE_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        assert response.status_code == 403

        response = self.JANE_CLIENT.post(self.JOHNS_GROUP_INVITES_URL)
        assert response.status_code == 403

        # John can invite Jane
        response = self.JOHN_CLIENT.post(self.JOHNS_GROUP_INVITES_URL, {
            'user_id': str(self.JANE.id)
        })
        assert response.status_code == 200

        # John can see Jane as invited user
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        res_json = response.json()
        assert len(res_json['invites']) == 1
        assert res_json['invites'] == [jsonify(self.JANE.to_dict_for_others(
            for_user=self.JOHN, for_group=self.JOHNS_GROUP, show_debt=False
        ))]
        assert response.status_code == 200

        # Trump can also see Jane as invited user
        response = self.TRUMP_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        res_json = response.json()
        assert len(res_json['invites']) == 1
        assert res_json['invites'] == [jsonify(self.JANE.to_dict_for_others(
            for_user=self.JOHN, for_group=self.JOHNS_GROUP, show_debt=False
        ))]
        assert response.status_code == 200

        # Jane rejects group invite
        reject_url = self.JOHNS_GROUP_INVITES_URL + 'decline/'
        response = self.JANE_CLIENT.post(reject_url)
        assert response.status_code == 200

        # John cannot see Jane invite anymore
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        res_json = response.json()
        assert len(res_json['invites']) == 0
        assert response.status_code == 200

        # Trump can also invite Jane
        response = self.TRUMP_CLIENT.post(self.JOHNS_GROUP_INVITES_URL, {
            'user_id': str(self.JANE.id)
        })
        assert response.status_code == 200

        # Jane can accept invite
        accept_url = self.JOHNS_GROUP_INVITES_URL + 'accept/'
        response = self.JANE_CLIENT.post(accept_url)
        assert response.status_code == 200

        # Invite to Jane no longer exists
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_INVITES_URL)
        res_json = response.json()
        assert len(res_json['invites']) == 0
        assert response.status_code == 200

        # John can see new group members
        response = self.JOHN_CLIENT.get(self.JOHNS_GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        dicts = User.to_dicts_for_others(
            [self.JOHN, self.TRUMP, self.JANE], self.JOHN,
            for_group=self.JOHNS_GROUP, show_debt=True
        )
        assert sorted(res_json['members'], key=lambda x: x['id']) \
               == sorted([jsonify(m) for m in dicts], key=lambda x: x['id'])

        # Jane can see new group members
        response = self.JANE_CLIENT.get(self.JOHNS_GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        dicts = User.to_dicts_for_others(
            [self.JOHN, self.TRUMP, self.JANE], self.JANE,
            for_group=self.JOHNS_GROUP, show_debt=True
        )
        assert sorted(res_json['members'], key=lambda x: x['id']) \
               == sorted([jsonify(m) for m in dicts], key=lambda x: x['id'])

        # Trump can see new group members
        response = self.TRUMP_CLIENT.get(self.JOHNS_GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        dicts = User.to_dicts_for_others(
            [self.JOHN, self.TRUMP, self.JANE], self.TRUMP,
            for_group=self.JOHNS_GROUP, show_debt=True
        )
        assert sorted(res_json['members'], key=lambda x: x['id']) \
               == sorted([jsonify(m) for m in dicts], key=lambda x: x['id'])


class GroupEntries(TestCase):

    GROUP_MEMBERS_URL = '/api/groups/%s/members/'
    GROUP_ENTRIES_URL = '/api/groups/%s/entries/'
    GROUP_BILLS_URL = '/api/groups/%s/bills/'
    GROUP_PAYMENTS_URL = '/api/groups/%s/payments/'

    @classmethod
    def setUpTestData(cls):
        # People in group
        cls.JOHN = User.objects.create_user(
            'John Smith', 'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE = User.objects.create_user(
            'Jane Doe', 'janedoe@gmail.com', 'janedoe94'
        )
        cls.TRUMP = User.objects.create_user(
            'Donald Trump', 'realdonaldtrump@gmail.com', 'djt'
        )

        # People outside group
        cls.BILL = User.objects.create_user(
            'Bill Gates', 'billgates@outlook.com', 'bg'
        )
        cls.JOHNS_GROUP = Group.objects.create_group('John\'s Group', cls.JOHN)
        cls.JOHNS_GROUP.invited_users.add(cls.TRUMP)
        cls.JOHNS_GROUP.invited_users.add(cls.JANE)
        cls.JOHNS_GROUP.add_member(cls.TRUMP)
        cls.JOHNS_GROUP.add_member(cls.JANE)
        cls.JOHN_CLIENT = get_client_with_credentials(
            'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE_CLIENT = get_client_with_credentials(
            'janedoe@gmail.com', 'janedoe94'
        )
        cls.TRUMP_CLIENT = get_client_with_credentials(
            'realdonaldtrump@gmail.com', 'djt'
        )
        cls.BILL_CLIENT = get_client_with_credentials(
            'billgates@outlook.com', 'bg'
        )

        cls.GROUP_MEMBERS_URL = cls.GROUP_MEMBERS_URL % str(cls.JOHNS_GROUP.id)
        cls.GROUP_ENTRIES_URL = cls.GROUP_ENTRIES_URL % str(cls.JOHNS_GROUP.id)
        cls.GROUP_BILLS_URL = cls.GROUP_BILLS_URL % str(cls.JOHNS_GROUP.id)
        cls.GROUP_PAYMENTS_URL = cls.GROUP_PAYMENTS_URL % str(cls.JOHNS_GROUP.id)

        # Test bill
        bill = Bill.objects.create_bill(
            'Breakfast', group=cls.JOHNS_GROUP, creator=cls.JOHN,
            initiator=cls.JOHN, amount=25.59, loans={
                cls.JANE: 7.12,
                cls.TRUMP: 8.38,
            }
        )

        cls.GROUP_BILL_URL = cls.GROUP_BILLS_URL + str(bill.id) + '/'

        # Test payment
        # Payment.objects.create_payment(
        #     cls.JOHNS_GROUP, creator=cls.JANE, amount=7.12,
        #     receiver=cls.JOHN
        # )

    def test_get_entries(self):
        # TODO: Maybe make this test more robust. Right now only test
        # correct amount shown for user.

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.GROUP_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == "15.50"

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        email_user_map = {m['emailAddress']: m for m in res_json['members']}
        assert 'debt' not in email_user_map[self.JOHN.email_address]
        assert email_user_map[self.JANE.email_address]['debt'] == '7.12'
        assert email_user_map[self.TRUMP.email_address]['debt'] == '8.38'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.GROUP_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == "-7.12"

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        email_user_map = {m['emailAddress']: m for m in res_json['members']}
        assert 'debt' not in email_user_map[self.JANE.email_address]
        assert email_user_map[self.JOHN.email_address]['debt'] == '-7.12'
        assert email_user_map[self.TRUMP.email_address]['debt'] == '0.00'

        # Get Trump's entry perspective
        response = self.TRUMP_CLIENT.get(self.GROUP_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == "-8.38"

        # Get Trump's debt perspective
        response = self.TRUMP_CLIENT.get(self.GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        email_user_map = {m['emailAddress']: m for m in res_json['members']}
        assert 'debt' not in email_user_map[self.TRUMP.email_address]
        assert email_user_map[self.JOHN.email_address]['debt'] == '-8.38'
        assert email_user_map[self.JANE.email_address]['debt'] == '0.00'

    def test_add_bill(self):
        response = self.JOHN_CLIENT.post(self.GROUP_BILLS_URL, {
            'name': 'Lunch',
            'initiator': str(self.TRUMP.id),
            'creator': str(self.JANE.id),
            'amount': '43.57',
            'loans': {
                str(self.JOHN.id): '15.63',
                str(self.JANE.id): '14.99'
            }
        }, content_type='application/json')
        assert response.status_code == 200

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.GROUP_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['userAmount'] == '-15.63'
        assert res_json['entries'][1]['userAmount'] == '15.50'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        email_user_map = {m['emailAddress']: m for m in res_json['members']}
        assert 'debt' not in email_user_map[self.JOHN.email_address]
        assert email_user_map[self.JANE.email_address]['debt'] == '7.12'
        assert email_user_map[self.TRUMP.email_address]['debt'] == '-7.25'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.GROUP_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['userAmount'] == '-14.99'
        assert res_json['entries'][1]['userAmount'] == '-7.12'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        email_user_map = {m['emailAddress']: m for m in res_json['members']}
        assert 'debt' not in email_user_map[self.JANE.email_address]
        assert email_user_map[self.JOHN.email_address]['debt'] == '-7.12'
        assert email_user_map[self.TRUMP.email_address]['debt'] == '-14.99'

        # Get Trump's entry perspective
        response = self.TRUMP_CLIENT.get(self.GROUP_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['userAmount'] == '30.62'
        assert res_json['entries'][1]['userAmount'] == '-8.38'

        # Get Trump's debt perspective
        response = self.TRUMP_CLIENT.get(self.GROUP_MEMBERS_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['members']) == 3
        email_user_map = {m['emailAddress']: m for m in res_json['members']}
        assert 'debt' not in email_user_map[self.TRUMP.email_address]
        assert email_user_map[self.JOHN.email_address]['debt'] == '7.25'
        assert email_user_map[self.JANE.email_address]['debt'] == '14.99'

    def test_delete_bill(self):
        response = self.JOHN_CLIENT.delete(self.GROUP_BILL_URL)
        assert response.status_code == 200

    def test_add_payment(self):
        pass

    def test_edit_bill(self):
        pass
