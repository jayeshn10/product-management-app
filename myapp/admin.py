from django.contrib import admin

# Register your models here.
from myapp.models import Product

admin.site.register(Product)