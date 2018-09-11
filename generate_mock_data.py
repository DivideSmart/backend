import os, sys
import django

sys.path.append('./dividesmart')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dividesmart.settings')
django.setup()


from main import models

for user in models.User.objects.all():
    user.delete()

# for i in range(1,11):
#     mock_user = models.User(
#         username='org'+str(i),
#         email_address=str(i)+'@org.com',
#         user_type=2,
#         system_config=config,
#     )
#     mock_user.save()
