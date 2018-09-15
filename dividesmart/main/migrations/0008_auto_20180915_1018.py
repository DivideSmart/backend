# Generated by Django 2.1.1 on 2018-09-15 02:18

from django.db import migrations, models
import main.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_auto_20180914_2111'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=main.models.user_avatar_upload_to),
        ),
        migrations.AddField(
            model_name='user',
            name='external_avatar_url',
            field=models.TextField(blank=True, null=True),
        ),
    ]
