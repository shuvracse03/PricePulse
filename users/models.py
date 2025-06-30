from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended User model for price tracking"""
    ROLE_CHOICES = [
        ('GENERAL', 'General User'),
        ('ADMIN', 'Admin User'),
    ]
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='GENERAL')
    profile_image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email or self.username

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

    @property
    def is_admin(self):
        return self.role == 'ADMIN' or self.is_superuser


class UserProfile(models.Model):
    """Additional profile information for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    preferred_currency = models.CharField(max_length=3, default='USD')
    email_notifications = models.BooleanField(default=True)
    price_alert_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email}"