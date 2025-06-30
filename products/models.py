from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "subcategories"
        ordering = ['name']
        unique_together = ['category', 'slug']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Location(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['country', 'name']

    def __str__(self):
        return f"{self.name}, {self.country}"


class Provider(models.Model):
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    logo = models.URLField(blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    brand = models.CharField(max_length=255, blank=True, null=True)
    model = models.CharField(max_length=255, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def current_lowest_price(self):
        """Get the current lowest price for this product"""
        from prices.models import Price
        latest_prices = Price.objects.filter(
            product=self,
            is_available=True
        ).order_by('price').first()
        return latest_prices.price if latest_prices else None


class Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=255)  # e.g., "Large", "Red", "128GB"
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class ProductProvider(models.Model):
    """Junction table for products and providers"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    product_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['product', 'provider']

    def __str__(self):
        return f"{self.product.name} at {self.provider.name}"