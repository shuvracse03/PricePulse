from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Avg, Min, Max
from datetime import datetime, timedelta

from .models import Price, PriceAlert, PriceScrapeLog
from .serializers import PriceSerializer, PriceAlertSerializer, PriceScrapeLogSerializer


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.select_related('product', 'provider', 'variant')
    serializer_class = PriceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['price', 'timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by product if provided
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        # Filter by provider if provided
        provider_id = self.request.query_params.get('provider_id')
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)
            
        # Filter by date range
        days = self.request.query_params.get('days', 30)
        try:
            days = int(days)
            start_date = datetime.now() - timedelta(days=days)
            queryset = queryset.filter(timestamp__gte=start_date)
        except ValueError:
            pass
            
        return queryset

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get price statistics"""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=400)

        prices = Price.objects.filter(product_id=product_id, is_available=True)
        
        if not prices.exists():
            return Response({'statistics': None})

        stats = prices.aggregate(
            min_price=Min('price'),
            max_price=Max('price'),
            avg_price=Avg('price')
        )
        
        stats['count'] = prices.count()
        return Response({'statistics': stats})


class PriceAlertViewSet(viewsets.ModelViewSet):
    serializer_class = PriceAlertSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Only return current user's alerts"""
        return PriceAlert.objects.filter(user=self.request.user).select_related('product')

    @action(detail=False, methods=['get'])
    def triggered(self, request):
        """Get alerts that have been triggered"""
        alerts = self.get_queryset().filter(is_active=True)
        triggered_alerts = [alert for alert in alerts if alert.alert_triggered]
        
        serializer = self.get_serializer(triggered_alerts, many=True)
        return Response({'triggered_alerts': serializer.data})


class PriceScrapeLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PriceScrapeLog.objects.select_related('provider', 'product')
    serializer_class = PriceScrapeLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['started_at', 'completed_at']
    ordering = ['-started_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by provider if provided
        provider_id = self.request.query_params.get('provider_id')
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)
        
        # Filter by status if provided
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset