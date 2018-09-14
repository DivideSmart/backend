# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.mail import send_mail
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, BaseUserManager
)
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


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


class User(AbstractBaseUser, PermissionsMixin):
    email_address = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=128)
    balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    date_joined = models.DateTimeField(default=timezone.now)
    friends = models.ManyToManyField('self')
    requested_friends = models.ManyToManyField(
        'self', related_name='received_friend_requests', symmetrical=False)

    is_active = models.BooleanField(
        default=True,
    )

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

    # def get_full_name(self):
    #     """
    #     Return the first_name plus the last_name, with a space in between.
    #     """
    #     full_name = '%s %s' % (self.first_name, self.last_name)
    #     return full_name.strip()

    # def get_short_name(self):
    #     """Return the short name for the user."""
    #     return self.first_name

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
    name = models.CharField(max_length=50)
    date_created = models.DateTimeField(default=timezone.now)
    creator = models.ForeignKey(
        User, related_name='groups_created', on_delete=models.CASCADE)
    users = models.ManyToManyField(User)

    objects = GroupManager()


class Debt(models.Model):
    OWE = 'OWE'
    LENT = 'LENT'
    SETTLED = 'SETTLED'
    DEBT_TYPES = [(OWE, 'owes'), (LENT, 'lent'), (SETTLED, 'settled')]

    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)
    user1 = models.ForeignKey(
        User, related_name='debt_source', on_delete=models.CASCADE)
    user2 = models.ForeignKey(
        User, related_name='debt_dest', on_delete=models.CASCADE)
    type = models.CharField(max_length=4, choices=DEBT_TYPES)
    amount = models.DecimalField(max_digits=20, decimal_places=2)


class Bill(models.Model):
    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(
        User, related_name='bills_created', on_delete=models.CASCADE)
    initiator = models.ForeignKey(
        User, related_name='bills_initiated', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    date_created = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)


class Loan(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    initiator = models.ForeignKey(
        User, related_name='loans_initiated', on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User, related_name='loans_received', on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)


class Payment(models.Model):
    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)
    initiator = models.ForeignKey(
        User, related_name='payments_initiated', on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User, related_name='payments_received', on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date_created = models.DateTimeField(default=timezone.now)
