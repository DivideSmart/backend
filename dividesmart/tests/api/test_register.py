from django.test import TestCase
from tests.api.test_utils import *
from main.models import User


class RegistrationTest(TestCase):

    TEST_EMAIL = 'johnsmith@gmail.com'
    TEST_USERNAME = 'John Smith'
    TEST_PASSWORD = 'johnsmith123'

    def test_register_new_account(self):
        assert not User.objects.filter(email_address=self.TEST_EMAIL).exists()

        # first attempt to login but expect failure
        response = self.client.post(LOGIN_URL, {
            'email_address': self.TEST_EMAIL,
            'password': self.TEST_PASSWORD
        })
        assert response.status_code == 400

        # register this account
        response = self.client.post(REGISTER_URL, {
            'email_address': self.TEST_EMAIL,
            'username': self.TEST_USERNAME,
            'password': self.TEST_PASSWORD
        })
        assert response.status_code == 200
        json_response = response.json()
        assert json_response['success']

        assert User.objects.filter(email_address=self.TEST_EMAIL).exists()

        # login and expect success
        response = self.client.post(LOGIN_URL, {
            'email_address': self.TEST_EMAIL,
            'password': self.TEST_PASSWORD
        })
        assert response.status_code == 200
