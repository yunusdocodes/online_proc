# Generated by Django 5.1.5 on 2025-02-26 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0012_test_correct_answer_test_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='correct_answer',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='test',
            name='correct_answer',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
