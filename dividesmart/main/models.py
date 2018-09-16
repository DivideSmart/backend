# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from decimal import Decimal

from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.core.mail import send_mail
from django.db import models
from django.forms.models import model_to_dict
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
        'self', related_name='received_friend_requests', symmetrical=False
    )

    avatar = models.ImageField(
        upload_to=user_avatar_upload_to, blank=True, null=True
    )
    external_avatar_url = models.TextField(blank=True, null=True)

    @property
    def portrait_url(self):
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        elif self.external_avatar_url:
            return self.external_avatar_url
        else:
            return "/media/portrait/default_portrait.png"

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


class GroupManager(models.Manager):
    use_in_migrations = True

    def create_group(self, name, user):
        group = self.model(name=name)
        group.creator = user
        group.save(using=self._db)
        group = Group.objects.get(id=group.id)
        group.users.add(user)
        group.save(using=self._db)
        return group


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    date_created = models.DateTimeField(default=timezone.now)
    creator = models.ForeignKey(
        User, related_name='groups_created', on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='joined_groups')
    invited_users = models.ManyToManyField(User, related_name='group_invites')

    objects = GroupManager()

    def has_member(self, user):
        return bool(self.users.filter(pk=user.pk).first())

    def has_invited_member(self, user):
        return bool(self.invited_users.filter(pk=user.pk).first())


class Debt(models.Model):
    """
    amount > 0: `user` is owed `amount` by `other_user`.
    amount = 0: `user` and `other_user` are settled up.
    amount < 0: `user` owes `amount` to `other_user`.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)
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
    group = models.ForeignKey(
        Group, null=True, related_name='entries', on_delete=models.CASCADE)
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

    def to_dict_for_user(self):
        raise RuntimeError('Implement me')


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

    def create_payment(self, group, creator, amount, receiver):
        assert creator.pk != receiver.pk
        payment = Payment(
            group=group,
            creator=creator,
            initiator=creator,
            amount=amount,
            receiver=receiver
        )
        payment.save()

        # Create participations
        payer_part = EntryParticipation(
            participant=creator, entry=payment,
            amount=0  # we don't really need this value if im not wrong
        )
        payee_part = EntryParticipation(
            participant=receiver, entry=payment, amount=0
        )
        payer_part.save()
        payee_part.save()

        # Update debts
        payer_debt = Debt.objects.get(
            group=group, user=creator, other_user=receiver
        )
        payee_debt = Debt.objects.get(
            group=group, user=receiver, other_user=creator
        )
        payer_debt.amount += Decimal(amount)
        payee_debt.amount -= Decimal(amount)
        payer_debt.save()
        payee_debt.save()

        return payment

    def update_payment(self):
        # maybe add a "type" and restrict only to cash payment to be
        # editable / deletable
        pass

    def delete_payment(self):
        # maybe add a "type" and restrict only to cash payment to be
        # editable / deletable
        pass


class Payment(Entry):
    receiver = models.ForeignKey(
        User, related_name='payments_received', on_delete=models.CASCADE
    )

    objects = PaymentManager()

    def to_dict(self):
        return model_to_dict(
            self,
            fields=['creator', 'initiator', 'amount',
                    'receiver', 'date_created']
        )

    def to_dict_for_user(self, user):
        payment_json = self.to_dict()
        payment_json['id'] = self.id
        return payment_json


class BillManager(PolymorphicManager):
    use_in_migrations = True

    def create_bill(self, name, group, creator, initiator, amount, loans):
        # loans is a list of tuples [(loan_user, loan_amount), ...]
        # Assumes that this data is sane
        # (e.g. creator is in group, loaner in group)
        bill = Bill(
            group=group,
            name=name,
            creator=creator,
            initiator=initiator,
            amount=amount
        )
        bill.save()

        if not group:
            assert(len(loans) == 1)

        loaner_gets_back = 0
        # Handle loanees
        for loan_user, loan_amt in loans.items():
            loaner_gets_back += loan_amt
            bill_participation = EntryParticipation(
                participant=loan_user,
                entry=bill,
                amount=Decimal(-loan_amt),
            )
            bill_participation.save()

            # Update debts
            loaner_debt = (
                Debt.objects
                .filter(group=group, user=initiator, other_user=loan_user)
                .first()
            )
            receiver_debt = (
                Debt.objects
                .filter(group=group, user=loan_user, other_user=initiator)
                .first()
            )
            loaner_debt.amount += Decimal(loan_amt)
            receiver_debt.amount -= Decimal(loan_amt)
            loaner_debt.save()
            receiver_debt.save()

            # create loan objects attached to bill
            Loan.objects.create(
                bill=bill,
                receiver=loan_user,
                amount=loan_amt
            )

        # Handle loaner
        bill_loan_participation = EntryParticipation(
            participant=initiator,
            entry=bill,
            amount=Decimal(loaner_gets_back),
        )
        bill_loan_participation.save()

        return bill

    def update_bill(self, new_name, new_initiator, new_amount, new_loans):
        pass

    def delete_bill(self):
        pass


class Bill(Entry):

    objects = BillManager()

    def to_dict(self):
        return model_to_dict(
            self,
            fields=['name', 'creator', 'initiator', 'date_created']
        )

    def to_dict_for_user(self, user):
        assert(self.participants.filter(id=user.id).first())
        bill = self.to_dict()
        bill['user_amount'] = EntryParticipation.objects.get(
            participant=user, entry=self
        ).amount
        bill['id'] = self.id
        return bill


class Loan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bill = models.ForeignKey(
        Bill, related_name='loans', on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name='loans_received', on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
