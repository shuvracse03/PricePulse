from rest_framework import serializers
from .models import Category, Subcategory, Location, Provider, Product, Variant, ProductProvider


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'created_at', 'products_count']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class SubcategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'slug', 'image', 'category', 'category_name', 'created_at', 'products_count']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'country', 'city', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProviderSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = Provider
        fields = ['id', 'name', 'website', 'logo', 'location', 'location_name', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'name', 'sku', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    variants = VariantSerializer(many=True, read_only=True)
    current_lowest_price = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'brand', 'model', 'image',
            'category', 'category_name', 'subcategory', 'subcategory_name',
            'variants', 'current_lowest_price', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductProviderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)

    class Meta:
        model = ProductProvider
        fields = ['id', 'product', 'product_name', 'provider', 'provider_name', 'product_url', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']