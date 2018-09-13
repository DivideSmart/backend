# Generated by Django 2.1.1 on 2018-09-13 11:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_user_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='requested_friends',
            field=models.ManyToManyField(related_name='received_friend_requests', to=settings.AUTH_USER_MODEL),
        ),
    ]
