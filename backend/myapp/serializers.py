from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator
from .models import UserProfile


# ==========================================
# 🔐 Basic User Serializer for Admin/User Ops
# ==========================================

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Username already exists.")]
    )

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email already exists.")]
    )

    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)

        if password:
            user.password = make_password(password)

        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.password = make_password(password)

        instance.save()
        return instance

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', required=False)
    courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'date_joined', 'avatar', 'courses']

    def update(self, instance, validated_data):
        # Pop out nested profile data if present
        user_profile_data = validated_data.pop('profile', {})

        # Update User model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update avatar in UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=instance)
        avatar = user_profile_data.get('avatar')

        if avatar:
            profile.avatar = avatar
            profile.save()

        return instance

    def get_courses(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.courses.exists():
            return [
                {
                    'name': lesson.title,
                    'icon': lesson.icon.url if lesson.icon else None
                }
                for lesson in profile.courses.all()
            ]
        return []