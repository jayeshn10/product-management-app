
from django_elasticsearch_dsl_drf import serializers
import rest_framework.serializers as myserializers

from myapp.documents import ProductDocument
from myapp.models import Product


class ProductDocumentSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Product
        document = ProductDocument
        fields = '__all__'

        def get_location(self, obj):
            try:
                return obj.location.to_dict()
            except:
                return {}


class ProductSerializer(myserializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
