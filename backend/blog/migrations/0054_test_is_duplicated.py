# Generated by Django 5.2 on 2025-04-28 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0053_studentcapture'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='is_Duplicated',
            field=models.BooleanField(default=False),
        ),
    ]
