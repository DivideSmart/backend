from django.test import TestCase


class RegistrationTest(TestCase):

    TEST_EMAIL = 'johnsmith@gmail.com'
    TEST_USERNAME = 'John Smith'
    TEST_PASSWORD = 'johnsmith123'

    LOGIN_URL = '/api/login/'
    REGISTER_URL = '/api/register/'

    def test_register_new_account(self):
        # first attempt to login but expect failure
        response = self.client.post(self.LOGIN_URL, {
            'email_address': self.TEST_EMAIL,
            'password': self.TEST_PASSWORD
        })
        assert response.status_code == 400

        # register this account
        response = self.client.post(self.REGISTER_URL, {
            'email_address': self.TEST_EMAIL,
            'username': self.TEST_USERNAME,
            'password': self.TEST_PASSWORD
        })
        assert response.status_code == 200

        # login and expect success
        response = self.client.post(self.LOGIN_URL, {
            'email_address': self.TEST_EMAIL,
            'password': self.TEST_PASSWORD
        })
        assert response.status_code == 200
