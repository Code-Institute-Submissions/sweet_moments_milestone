# Generated by Django 3.1 on 2020-09-18 13:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0010_auto_20200918_1315'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('checkout', '0002_auto_20200918_1314'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.CharField(editable=False, max_length=32)),
                ('status', models.BooleanField(default=False)),
                ('email', models.CharField(editable=False, max_length=32)),
                ('telephone', models.CharField(max_length=20)),
                ('country', models.CharField(max_length=40)),
                ('county', models.CharField(max_length=40)),
                ('address_1', models.CharField(max_length=4)),
                ('address_2', models.CharField(max_length=4)),
                ('date', models.DateField(auto_now_add=True)),
                ('grand_total', models.DecimalField(decimal_places=2, default=0, editable=False, max_digits=10)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0)),
                ('order_item_total', models.DecimalField(decimal_places=2, max_digits=6)),
                ('order_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='checkout.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.products')),
            ],
        ),
    ]
