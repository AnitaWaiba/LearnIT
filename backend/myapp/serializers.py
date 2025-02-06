from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    # ✅ Username with UniqueValidator
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Username already exists.")]
    )

    # ✅ Email with UniqueValidator (optional but recommended)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email already exists.")]
    )

    # ✅ Password (write_only)
    password = serializers.CharField(
        write_only=True,
        required=False,  # Optional for updates
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'password']

    # ✅ CREATE (with password hashing)
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)

        if password:
            user.password = make_password(password)

        user.save()
        return user

    # # ✅ UPDATE (with password hashing)
    # def update(self, instance, validated_data):
    #     password = validated_data.pop('password', None)

    #     # Update all the remaining fields
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)

    #     # If password provided, hash it
    #     if password:
    #         instance.password = make_password(password)

    #     instance.save()
    #     return instance
