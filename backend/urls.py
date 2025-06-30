"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from products.views import (
    CategoryViewSet, SubcategoryViewSet, LocationViewSet,
    ProviderViewSet, ProductViewSet, VariantViewSet, ProductProviderViewSet
)
from prices.views import PriceViewSet, PriceAlertViewSet, PriceScrapeLogViewSet
from users.views import UserViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubcategoryViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'providers', ProviderViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variants', VariantViewSet)
router.register(r'product-providers', ProductProviderViewSet)
router.register(r'prices', PriceViewSet)
router.register(r'price-alerts', PriceAlertViewSet)
router.register(r'scrape-logs', PriceScrapeLogViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Authentication
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Routes
    path('api/', include(router.urls)),
    
    # API Authentication browsable interface
    path('api-auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)