# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from decimal import Decimal

from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from polymorphic.models import PolymorphicModel, PolymorphicManager
import uuid


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, email_address, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        email_address = self.normalize_email(email_address)
        user = self.model(username=username, email_address=email_address, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email_address=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email_address, password, **extra_fields)

    def create_superuser(self, username, email_address, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email_address, password, **extra_fields)


def user_avatar_upload_to(instance, filename):
    name_without_extension, extension = filename.split(".")
    # if a user with sign-in email = user@email.com uploads file name.png
    # the file will be store at media/portrait/user@email.com/portrait.png
    return '{0}/{1}/{2}.{3}'.format("avatars", instance.email_address, "avatar", extension)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email_address = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=128)
    balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    date_joined = models.DateTimeField(default=timezone.now)
    friends = models.ManyToManyField('self')
    requested_friends = models.ManyToManyField(
        'self', related_name='received_friend_requests', symmetrical=False,
        blank=True
    )

    avatar = models.ImageField(
        upload_to=user_avatar_upload_to, blank=True, null=True
    )
    external_avatar_url = models.TextField(blank=True, null=True)

    @property
    def avatar_url(self):
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        elif self.external_avatar_url:
            return self.external_avatar_url
        else:
            return "/media/avatars/default_avatar.png"

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )

    USERNAME_FIELD = 'email_address'
    EMAIL_FIELD = 'email_address'

    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def clean(self):
        super().clean()
        self.email_address = self.__class__.objects.normalize_email(self.email_address)

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email_address], **kwargs)

    def to_dict(self):
        user_json = {
            'id': self.id,
            'emailAddress': self.email_address,
            'username': self.username,
            'avatarUrl': self.avatar_url,
        }
        return user_json

    def to_dict_for_self(self):
        user_json = self.to_dict()
        return user_json

    def to_dict_for_others(self, for_user, show_debt=True):
        user_json = self.to_dict()
        if show_debt and for_user.id != self.id:
            debt_amount = Debt.objects.get(
                user=for_user, other_user=self,
            ).amount
            user_json['debt'] = debt_amount
        return user_json

    @classmethod
    def to_dicts_for_others(cls, users, for_user, show_debt=True):
        return [u.to_dict_for_others(for_user, show_debt)
                for u in users]

    def has_friend_request(self, from_user_id):
        return self.received_friend_requests.filter(id=from_user_id).exists()

    def has_friend(self, user_id):
        return self.friends.filter(id=user_id).exists()

    def send_friend_request(self, to_user):
        self.requested_friends.add(to_user)
        self.save()

    def accept_friend_request(self, from_user):
        if not self.has_friend_request(from_user.id):
            return
        self.received_friend_requests.remove(from_user)
        self.friends.add(from_user)
        Debt.objects.create_debt(self, from_user)
        self.save()
        from_user.save()


class GroupManager(models.Manager):
    use_in_migrations = True

    def create_group(self, name, user, invited_users=None):
        group = self.model(name=name)
        group.creator = user
        group.save(using=self._db)
        group.add_member(user)
        if invited_users:
            for invited_user in invited_users:
                if group.has_member(invited_user):
                    continue
                group.add_member(invited_user)
        return group


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    date_created = models.DateTimeField(default=timezone.now)
    creator = models.ForeignKey(
        User, related_name='groups_created', on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='joined_groups')

    objects = GroupManager()

    def has_member(self, user):
        return self.users.filter(id=user.id).exists()

    def add_member(self, user):
        self.users.add(user)
        self.save()
        Debt.objects.create_debt_for_group(user=user, group=self)

    def to_dict(self):
        group_json = {
            'id': self.id,
            'name': self.name,
            'dateCreated': self.date_created,
            'creator': self.creator.id
        }
        return group_json

    @classmethod
    def to_dicts(cls, groups):
        return [g.to_dict() for g in groups]


class DebtManager(models.Manager):

    def create_debt(self, user, other_user):
        if user.id == other_user.id:
            return
        Debt.objects.create(user=user, other_user=other_user)
        Debt.objects.create(user=other_user, other_user=user)

    def create_debt_for_group(self, user, group):
        for member in group.users.all():
            if user.id == member.id:
                continue
            user.accept_friend_request(member)
            member.accept_friend_request(user)
            if user.has_friend(member.id):
                continue
            user.send_friend_request(member)
            member.accept_friend_request(user)

class Debt(models.Model):
    """
    amount > 0: `user` is owed `amount` by `other_user`.
    amount = 0: `user` and `other_user` are settled up.
    amount < 0: `user` owes `amount` to `other_user`.
    """
    use_in_migrations = True

    objects = DebtManager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, related_name='debt_source', on_delete=models.CASCADE)
    other_user = models.ForeignKey(
        User, related_name='debt_dest', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=20, decimal_places=2, default=0)


class Entry(PolymorphicModel):
    """
    This PolymorphicModel simplifies multi-table inheritance.
    I need this so that it is easier to get all entries (bills + payments)
    in a sorted order by date created
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(
        User, related_name='entries_created', on_delete=models.CASCADE)
    initiator = models.ForeignKey(
        User, related_name='entries_initiated', on_delete=models.CASCADE
    )
    date_created = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)
    participants = models.ManyToManyField(
        User, related_name='participating_entries',
        through='EntryParticipation')
    amount = models.DecimalField(max_digits=18, decimal_places=2)

    def to_dict(self):
        raise RuntimeError('Implement me')

    def to_dict_for_user(self, user, friend=None, is_group=False):
        return self.to_dict()


class EntryParticipation(models.Model):
    """
    This model provides data for each person's participation in an
    entry. So different participation type and amount for different people.

    amount > 0: `user` is owed `amount`
    amount = 0: `user` and `other_user`
    amount < 0: `user` owes `amount`
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participant = models.ForeignKey(User, on_delete=models.CASCADE)
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=2)


class PaymentManager(PolymorphicManager):
    use_in_migrations = True

    def create_payment(self, creator, amount, receiver,
                       date_created=None):
        assert creator.id != receiver.id
        payment = Payment(
            creator=creator,
            initiator=creator,
            amount=amount,
            receiver=receiver
        )
        if date_created:
            payment.date_created = date_created
        payment.save()

        # Create participations
        payer_part = EntryParticipation(
            participant=creator, entry=payment, amount=0  # we don't really need this value if im not wrong
        )
        payee_part = EntryParticipation(
            participant=receiver, entry=payment, amount=0
        )
        payer_part.save()
        payee_part.save()

        # Update debts
        payer_debt = Debt.objects.get(user=creator, other_user=receiver)
        payee_debt = Debt.objects.get(user=receiver, other_user=creator)
        payer_debt.amount += Decimal(amount)
        payee_debt.amount -= Decimal(amount)
        payer_debt.save()
        payee_debt.save()

        return payment

    def update_payment(self, old_payment, new_amount):
        # Lazy way to updating...
        new_payment = self.create_payment(
            creator=old_payment.creator, amount=new_amount,
            receiver=old_payment.receiver,
            date_created=old_payment.date_created
        )
        self.delete_payment(old_payment)
        return new_payment

    def delete_payment(self, payment):
        # Update debts for payer and payee
        payer_debt = Debt.objects.get(
            user=payment.creator, other_user=payment.receiver
        )
        payee_debt = Debt.objects.get(
            user=payment.receiver, other_user=payment.creator
        )
        payer_debt.amount -= Decimal(payment.amount)
        payee_debt.amount += Decimal(payment.amount)
        payer_debt.save()
        payee_debt.save()

        # Delete the actual payment
        payment.delete()


class Payment(Entry):
    receiver = models.ForeignKey(
        User, related_name='payments_received', on_delete=models.CASCADE
    )

    objects = PaymentManager()

    def to_dict(self):
        payment_json = {
            'type': 'payment',
            'id': self.id,
            'dateCreated': self.date_created,
            'creator': self.creator.id,
            'initiator': self.initiator.id,
            'amount': self.amount,
            'receiver': self.receiver.id
        }
        return payment_json


class BillManager(PolymorphicManager):
    use_in_migrations = True

    def create_bill(self, name, group, creator, initiator, amount, loans,
                    date_created=None):
        assert type(amount) is Decimal
        # loans is a list of tuples [(loan_user, loan_amount), ...]
        # Assumes that this data is sane
        # (e.g. creator is in group, loaner in group)
        bill = Bill(
            group=group,
            name=name,
            creator=creator,
            initiator=initiator,
            amount=Decimal(amount)
        )
        if date_created:
            bill.date_created = date_created
        bill.save()

        # if not group:
        #     assert len(loans) == 1

        loaner_gets_back = Decimal(0)
        # Handle loanees
        for loan_user, loan_amt in loans.items():
            assert type(loan_amt) is Decimal
            loaner_gets_back += Decimal(loan_amt)
            bill_participation = EntryParticipation(
                participant=loan_user, entry=bill, amount=-Decimal(loan_amt),
            )
            bill_participation.save()

            # Update debts
            loaner_debt = (
                Debt.objects.get(user=initiator, other_user=loan_user)
            )
            receiver_debt = (
                Debt.objects.get(user=loan_user, other_user=initiator)
            )
            loaner_debt.amount += Decimal(loan_amt)
            receiver_debt.amount -= Decimal(loan_amt)
            loaner_debt.save()
            receiver_debt.save()

            # create loan objects attached to bill
            Loan.objects.create(
                bill=bill,
                receiver=loan_user,
                amount=Decimal(loan_amt)
            )

        # Handle loaner
        bill_loan_participation = EntryParticipation(
            participant=initiator,
            entry=bill,
            amount=Decimal(loaner_gets_back),
        )
        bill_loan_participation.save()
        return bill

    def update_bill(self, bill, new_name, new_initiator,
                    new_amount, new_loans):

        # Lazy way delete old bill
        old_creator = bill.creator
        old_group = bill.group
        old_date_created = bill.date_created
        self.delete_bill(bill)

        # Insert new bill with new last update, old date created
        return self.create_bill(
            new_name, group=old_group, creator=old_creator,
            initiator=new_initiator, amount=new_amount, loans=new_loans,
            date_created=old_date_created)

    def delete_bill(self, bill):
        # First update all the debts involved (through the participations)
        participations = EntryParticipation.objects.filter(entry=bill).all()
        for participation in participations:
            if participation.participant.id == bill.initiator.id:
                continue

            # Update debts
            loaner_debt = (
                Debt.objects.get(user=bill.initiator,
                                 other_user=participation.participant)
            )
            receiver_debt = (
                Debt.objects
                .get(user=participation.participant, other_user=bill.initiator)
            )
            # participation amount is < 0 in receiver's perspective
            loaner_debt.amount += Decimal(participation.amount)
            receiver_debt.amount -= Decimal(participation.amount)
            loaner_debt.save()
            receiver_debt.save()

        # Delete this bill should propagate
        # to the loans and participations
        bill.delete()


class Bill(Entry):

    objects = BillManager()

    group = models.ForeignKey(
        Group, null=True, related_name='entries', on_delete=models.CASCADE)

    def to_dict(self):
        bill_json = {
            'type': 'bill',
            'id': self.id,
            'group': self.group.id if self.group else None,
            'name': self.name,
            'creator': self.creator.id,
            'initiator': self.initiator.id,
            'dateCreated': self.date_created,
            'billAmount': self.amount,
            'loans': {}
        }
        loans = Loan.objects.filter(bill=self).all()
        for loan in loans:
            bill_json['loans'][str(loan.receiver.id)] = loan.amount

        assert bill_json['loans']
        return bill_json

    def to_dict_for_user(self, user, friend=None, is_group=False):
        assert self.participants.filter(id=user.id).exists()
        bill_json = self.to_dict()
        if is_group:
            bill_json['userAmount'] = EntryParticipation.objects.get(
                participant=user, entry=self
            ).amount
        else:
            loaner = friend if self.initiator.id == user.id else user
            bill_json['userAmount'] = self.loans.get(receiver__id=loaner.id).amount
            if user.id == loaner.id:
                bill_json['userAmount'] *= -1

        return bill_json


class Loan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bill = models.ForeignKey(
        Bill, related_name='loans', on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name='loans_received', on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
