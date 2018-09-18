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

