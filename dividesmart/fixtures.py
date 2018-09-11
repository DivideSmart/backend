import os, sys
import django

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE', 'dividesmart.settings'
)
django.setup()

from main.models import *


User.objects.create_user(
    username='John Smith',
    email_address='johnsmith@gmail.com',
    password='johnsmith123'
)
