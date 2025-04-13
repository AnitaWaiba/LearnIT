from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator
from .models import UserProfile, Lesson, Question, Option

# ==========================
# 🔐 User Serializer
# ==========================
class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Username already exists.")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email already exists.")]
    )
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

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


# ==========================
# 👤 Profile Serializer
# ==========================
class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', required=False)
    courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'date_joined', 'avatar', 'courses']

    def update(self, instance, validated_data):
        user_profile_data = validated_data.pop('profile', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

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


# ==========================
# 🧩 Option Serializer
# ==========================
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct', 'match_pair']


# ==========================
# ❓ Question Serializer with nested Options
# ==========================
class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'lesson', 'type', 'text', 'hint', 'explanation', 'image', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)
        for option in options_data:
            Option.objects.create(question=question, **option)
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if options_data:
            instance.options.all().delete()
            for option in options_data:
                Option.objects.create(question=instance, **option)
        return instance


# ==========================
# 📚 Lesson Serializer
# ==========================
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'content', 'icon', 'created_at']


# ==========================
# 📘 Lesson Detail with nested questions
# ==========================
class LessonDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'content', 'icon', 'questions', 'created_at']
