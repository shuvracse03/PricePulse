from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 'country', 'city', 'preferred_currency',
            'email_notifications', 'price_alert_notifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    is_admin = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'profile_image_url', 'full_name', 'is_admin',
            'profile', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user