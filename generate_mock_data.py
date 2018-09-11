import os, sys
import django

sys.path.append('./dividesmart')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dividesmart.settings')
django.setup()


from main import models
