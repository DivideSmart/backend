# Generated by Django 2.1.1 on 2018-09-11 12:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='email',
            new_name='email_address',
        ),
    ]