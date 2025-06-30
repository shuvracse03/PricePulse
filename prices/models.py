from django.db import models
from django.contrib.auth.models import User
from products.models import Product, Provider, Variant


class Price(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='prices')
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name='prices')
    variant = models.ForeignKey(Variant, on_delete=models.SET_NULL, null=True, blank=True, related_name='prices')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    is_available = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['product', '-timestamp']),
            models.Index(fields=['provider', '-timestamp']),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.provider.name}: {self.currency} {self.price}"

    @property
    def formatted_price(self):
        return f"{self.currency} {self.price}"


class PriceAlert(models.Model):
    """User watchlist for price alerts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='price_alerts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_alerts')
    target_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

    @property
    def current_lowest_price(self):
        """Get current lowest price for the product"""
        latest_price = Price.objects.filter(
            product=self.product,
            is_available=True
        ).order_by('price').first()
        return latest_price.price if latest_price else None

    @property
    def alert_triggered(self):
        """Check if current price meets the target"""
        if not self.target_price:
            return False
        current_price = self.current_lowest_price
        return current_price and current_price <= self.target_price


class PriceScrapeLog(models.Model):
    """Log price scraping activities"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    prices_scraped = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"Scrape {self.provider.name} - {self.status}"

    @property
    def duration(self):
        """Calculate scraping duration"""
        if self.completed_at and self.started_at:
            return self.completed_at - self.started_at
        return None