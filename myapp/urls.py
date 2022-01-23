from django.urls import path
from . import views
from .views import ProductDocumentView, productCreate, productUpdate

urlpatterns = [
    path('', views.index, name="index"),
    path('product/create/', productCreate, name="product-create"),
    path('product/update/<str:pk>', productUpdate, name="product-update"),
    path('product/', ProductDocumentView.as_view({'get': 'list'}), name="product-all"),
]
