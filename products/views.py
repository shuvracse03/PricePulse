from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Category, Subcategory, Location, Provider, Product, Variant, ProductProvider
from .serializers import (
    CategorySerializer, SubcategorySerializer, LocationSerializer,
    ProviderSerializer, ProductSerializer, VariantSerializer, ProductProviderSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.select_related('category')
    serializer_class = SubcategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'category__name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country', 'city']
    ordering_fields = ['name', 'country', 'created_at']
    ordering = ['country', 'name']


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.select_related('location')
    serializer_class = ProviderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'is_active']
    search_fields = ['name', 'website']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'subcategory').prefetch_related('variants')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'subcategory', 'brand', 'is_active']
    search_fields = ['name', 'description', 'brand', 'model']
    ordering_fields = ['name', 'brand', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category or subcategory if provided
        category_id = self.request.query_params.get('category_id')
        subcategory_id = self.request.query_params.get('subcategory_id')
        
        if subcategory_id:
            queryset = queryset.filter(subcategory_id=subcategory_id)
        elif category_id:
            queryset = queryset.filter(category_id=category_id)
            
        return queryset

    @action(detail=True, methods=['get'])
    def price_history(self, request, pk=None):
        """Get price history for a specific product"""
        product = self.get_object()
        from prices.models import Price
        from prices.serializers import PriceSerializer
        
        prices = Price.objects.filter(product=product).order_by('-timestamp')[:30]
        serializer = PriceSerializer(prices, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search for products"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'products': []})

        products = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__icontains=query) |
            Q(model__icontains=query) |
            Q(category__name__icontains=query) |
            Q(subcategory__name__icontains=query)
        ).distinct()[:20]

        serializer = self.get_serializer(products, many=True)
        return Response({'products': serializer.data})


class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.select_related('product')
    serializer_class = VariantSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['product']
    search_fields = ['name', 'sku']


class ProductProviderViewSet(viewsets.ModelViewSet):
    queryset = ProductProvider.objects.select_related('product', 'provider')
    serializer_class = ProductProviderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product', 'provider', 'is_active']
    ordering_fields = ['created_at']
    ordering = ['-created_at']