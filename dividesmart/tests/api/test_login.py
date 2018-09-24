from django.test import TestCase
from main.models import User
from tests.api.test_utils import *


class LoginTest(TestCase):

    BAD_EMAIL = 'janedoe@gmail.com'
    BAD_PASSWORD = 'janedoe94'

    TEST_EMAIL = 'johnsmith@gmail.com'
    TEST_USERNAME = 'John Smith'
    TEST_PASSWORD = 'johnsmith123'

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            cls.TEST_USERNAME, cls.TEST_EMAIL, cls.TEST_PASSWORD
        )

    def test_login_non_existent_acc_fail(self):
        response = self.client.post(LOGIN_URL, {
            'email_address': self.BAD_EMAIL,
            'password': self.BAD_PASSWORD
        }, content_type='application/json')
        assert response.status_code == 400

    def test_login_real_acc_success(self):
        response = self.client.post(LOGIN_URL, {
            'email_address': self.TEST_EMAIL,
            'password': self.TEST_PASSWORD
        }, content_type='application/json')
        assert response.status_code == 200
