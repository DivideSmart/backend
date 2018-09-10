# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.mail import send_mail
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager
)
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self):
        pass


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    balance = models.DecimalField(max_digits=20, decimal_places=2)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Participating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=20, decimal_places=2)


class Exchange(models.Model):
    class Meta:
        abstract = True


# class PrivateExchange(Exchange):
#     pass
#
#
# class GroupExchange(Exchange):
#     name = models.CharField(max_length=50)
#     date_created = models.DateField()


class Entry(models.Model):
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    initiator = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    date_created = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)


class Payment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)


class Loan(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=20, decimal_places=2)