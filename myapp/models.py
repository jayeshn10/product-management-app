from django.db import models


# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=3)
    quantity = models.IntegerField()

    def __str__(self):
        return self.name
