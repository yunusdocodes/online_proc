# Generated by Django 5.1.5 on 2025-02-19 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newapp', '0031_remove_completedtest_title_completedtest_created_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='completedtest',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='completedtest',
            name='test',
        ),
        migrations.AddField(
            model_name='completedtest',
            name='title',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='completedtest',
            name='highest_score',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='completedtest',
            name='time_taken',
            field=models.CharField(max_length=100),
        ),
    ]
