from django.test import TestCase
from main.models import (
    User, Bill
)
from tests.api.test_utils import get_client_with_credentials


class UserEntriesTest(TestCase):

    FRIEND_URL = '/api/users/%s/friends/%s/'
    SUB_URL = '%s%s/'

    @classmethod
    def setUpTestData(cls):
        cls.JOHN = User.objects.create_user(
            'John Smith', 'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE = User.objects.create_user(
            'Jane Doe', 'janedoe@gmail.com', 'janedoe94'
        )
        cls.JOHN_CLIENT = get_client_with_credentials(
            'johnsmith@gmail.com', 'johnsmith123'
        )
        cls.JANE_CLIENT = get_client_with_credentials(
            'janedoe@gmail.com', 'janedoe94'
        )
        cls.JOHN.send_friend_request(cls.JANE)
        cls.JANE.accept_friend_request(cls.JOHN)

        cls.JOHNS_FRIEND_URL = cls.FRIEND_URL % (str(cls.JOHN.id),
                                                str(cls.JANE.id))
        cls.JOHN_ENTRIES_URL = cls.SUB_URL % (cls.JOHNS_FRIEND_URL, 'entries')
        cls.JOHN_BILLS_URL = cls.SUB_URL % (cls.JOHNS_FRIEND_URL, 'bills')
        cls.JOHN_PAYMENTS_URL = cls.SUB_URL % (cls.JOHNS_FRIEND_URL, 'payments')
        cls.JANE_FRIEND_URL = cls.FRIEND_URL % (str(cls.JANE.id),
                                                str(cls.JOHN.id))
        cls.JANE_ENTRIES_URL = cls.SUB_URL % (cls.JANE_FRIEND_URL, 'entries')
        cls.JANE_BILLS_URL = cls.SUB_URL % (cls.JANE_FRIEND_URL, 'bills')
        cls.JANE_PAYMENTS_URL = cls.SUB_URL % (cls.JANE_FRIEND_URL, 'payments')

        # Test bill
        cls.FRIEND_BILL = Bill.objects.create_bill(
            'Shirt', group=None, creator=cls.JOHN,
            initiator=cls.JOHN, amount=8.13, loans={
                cls.JANE: 3.56,
            }
        )
        cls.JOHN_BILL_URL = cls.JOHN_BILLS_URL + str(cls.FRIEND_BILL.id) + '/'

    def test_get_entries(self):
        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == '3.56'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '3.56'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == '-3.56'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '-3.56'

    def test_add_bill(self):
        response = self.JOHN_CLIENT.post(self.JOHN_BILLS_URL, {
            'name': 'Hat',
            'initiator': str(self.JANE.id),
            'amount': '30.59',
            'loans': {
                str(self.JOHN.id): '18.76',
            }
        }, content_type='application/json')
        assert response.status_code == 200

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['userAmount'] == '-18.76'
        assert res_json['entries'][1]['userAmount'] == '3.56'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '-15.20'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['userAmount'] == '18.76'
        assert res_json['entries'][1]['userAmount'] == '-3.56'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '15.20'

    def test_delete_bill(self):
        response = self.JOHN_CLIENT.delete(self.JOHN_BILL_URL)
        assert response.status_code == 200

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 0

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '0.00'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 0

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '0.00'

    def test_edit_bill(self):
        response = self.JOHN_CLIENT.put(self.JOHN_BILL_URL, {
            'name': 'Hat 3',
            'initiator': str(self.JOHN.id),
            'amount': '13.27',
            'loans': {
                str(self.JANE.id): '4.89',
            }
        }, content_type='application/json')
        assert response.status_code == 200

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == '4.89'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '4.89'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == '-4.89'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '-4.89'

    def test_payment(self):
        # Add payment
        response = self.JANE_CLIENT.post(self.JANE_PAYMENTS_URL, {
            'amount': '3.56',
        })
        PAYMENT_URL = self.JOHN_PAYMENTS_URL + response.json()['id'] + '/'
        assert response.status_code == 200

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['amount'] == '3.56'
        assert res_json['entries'][1]['userAmount'] == '3.56'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '0.00'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['amount'] == '3.56'
        assert res_json['entries'][1]['userAmount'] == '-3.56'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '0.00'

        # Edit payment
        response = self.JOHN_CLIENT.put(PAYMENT_URL, {
            'amount': '1.23'
        }, content_type='application/json')
        assert response.status_code == 200
        PAYMENT_URL = self.JANE_PAYMENTS_URL + response.json()['id'] + '/'

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['amount'] == '1.23'
        assert res_json['entries'][1]['userAmount'] == '3.56'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '2.33'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 2
        assert res_json['entries'][0]['amount'] == '1.23'
        assert res_json['entries'][1]['userAmount'] == '-3.56'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '-2.33'


        # Delete payment
        response = self.JANE_CLIENT.delete(PAYMENT_URL)
        assert response.status_code == 200

        # Get John's entry perspective
        response = self.JOHN_CLIENT.get(self.JOHN_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == '3.56'

        # Get John's debt perspective
        response = self.JOHN_CLIENT.get(self.JOHNS_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '3.56'

        # Get Jane's entry perspective
        response = self.JANE_CLIENT.get(self.JANE_ENTRIES_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert len(res_json['entries']) == 1
        assert res_json['entries'][0]['userAmount'] == '-3.56'

        # Get Jane's debt perspective
        response = self.JANE_CLIENT.get(self.JANE_FRIEND_URL)
        res_json = response.json()
        assert response.status_code == 200
        assert res_json['debt'] == '-3.56'
