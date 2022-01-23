from django_elasticsearch_dsl import Index, Document, fields

from myapp.models import Product

PUBLISHER_INDEX = Index('product')

PUBLISHER_INDEX.settings(
    number_of_shards=1,
    number_of_replicas=1
)


@PUBLISHER_INDEX.doc_type
class ProductDocument(Document):


    class Django:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'quantity',
        ]
    
    