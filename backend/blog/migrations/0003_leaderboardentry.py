# Generated by Django 5.1.5 on 2025-02-21 05:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_testsummary_rename_score_userresponse_attempts_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaderboardEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('username', models.CharField(max_length=100)),
                ('test_name', models.CharField(max_length=255)),
                ('rank', models.IntegerField()),
                ('score', models.IntegerField()),
                ('badges', models.JSONField(default=list)),
            ],
        ),
    ]
