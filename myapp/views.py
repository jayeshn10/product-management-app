from django.shortcuts import render

# Create your views here.
from django_elasticsearch_dsl_drf.filter_backends import FilteringFilterBackend, CompoundSearchFilterBackend, \
    DefaultOrderingFilterBackend
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_elasticsearch_dsl_drf.pagination import LimitOffsetPagination

from myapp.documents import ProductDocument
from myapp.models import Product
from myapp.serializers import ProductDocumentSerializer, ProductSerializer


def index(request):
    return render(request, 'index.html')


@api_view(['POST'])
def productCreate(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def productUpdate(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(instance=product, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


class ProductDocumentView(DocumentViewSet):
    document = ProductDocument
    serializer_class = ProductDocumentSerializer
    lookup_field = 'id'

    pagination_class = LimitOffsetPagination

    filter_backends = [
        FilteringFilterBackend,
        CompoundSearchFilterBackend,
        DefaultOrderingFilterBackend,
    ]
    search_fields = ('name',)
    fields_fields = {
        'name': 'name',
        'price': 'price',
        'quantity': 'quantity'
    }
    filter_fields = {
        'name': 'name',

    }
    ordering_fields = {
        'id': 'id', }

    ordering = ('-id',)
