from django.test import TestCase, Client
from main.models import User, Group
from tests.api.test_utils import LOGIN_URL
from django.http.response import JsonResponse
import ujson as json


def jsonify(obj):
    # Super weird way to get json (dict) equivalent
    return json.loads(JsonResponse(obj).content)


class GroupTest(TestCase):

    GROUP_URL = '/api/groups/%s/'
    GROUP_MEMBERS_URL = '/api/groups/%s/members/'
    GROUP_INVITES_URL = '/api/groups/%s/invites/'

    @staticmethod
    def get_client_with_credentials(email, password):
        client = Client()
        client.post(LOGIN_URL, {
            'email_address': email,
            'password': password
        })
        return client

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

        cls.JOHN_CLIENT = GroupTest.get_client_with_credentials(
            'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE_CLIENT = GroupTest.get_client_with_credentials(
            'janedoe@gmail.com', 'janedoe94'
        )
        cls.TRUMP_CLIENT = GroupTest.get_client_with_credentials(
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



    # def test_create_and_get_my_group(self):
    #     pass

    # # def test_get_my_other_group(self):
    # #     pass
    #
    # def test_get_not_my_group(self):
    #     pass
    #
    # def test_invite_user_to_my_group(self):
    #     pass
    #
    # def test_accept_invite_to_group(self):
    #     pass
    #
    # def test_reject_invite_to_group(self):
    #     pass

