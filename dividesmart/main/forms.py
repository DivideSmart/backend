from django import forms
from django.db import models
from main.models import (
    Group, User
)


# class GroupForm(forms.ModelForm):
#     class Meta:
#         model = Group

# class UserForm(forms.ModelForm):
#     class Meta:
#         model = User

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email_address', 'password']

    def validate_unique(self):
        pass
