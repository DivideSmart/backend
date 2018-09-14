from django import forms
from main.models import (
    User, Group
)


class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email_address', 'password']

    def validate_unique(self):
        pass


class RegistrationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email_address', 'username', 'password']


class CreateGroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = ['name']
