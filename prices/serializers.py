from rest_framework import serializers
from .models import Price, PriceAlert, PriceScrapeLog


class PriceSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    variant_name = serializers.CharField(source='variant.name', read_only=True)
    formatted_price = serializers.ReadOnlyField()

    class Meta:
        model = Price
        fields = [
            'id', 'product', 'product_name', 'provider', 'provider_name',
            'variant', 'variant_name', 'price', 'currency', 'is_available',
            'timestamp', 'formatted_price'
        ]
        read_only_fields = ['id', 'timestamp']


class PriceAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    current_lowest_price = serializers.ReadOnlyField()
    alert_triggered = serializers.ReadOnlyField()

    class Meta:
        model = PriceAlert
        fields = [
            'id', 'product', 'product_name', 'target_price', 'is_active',
            'created_at', 'updated_at', 'current_lowest_price', 'alert_triggered'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PriceScrapeLogSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    duration = serializers.ReadOnlyField()

    class Meta:
        model = PriceScrapeLog
        fields = [
            'id', 'provider', 'provider_name', 'product', 'product_name',
            'status', 'prices_scraped', 'error_message', 'started_at',
            'completed_at', 'duration'
        ]
        read_only_fields = ['id', 'started_at', 'completed_at']