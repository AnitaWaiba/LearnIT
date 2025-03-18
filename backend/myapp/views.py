# myapp/views.py

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Lesson, Enrollment, Review
from .serializers import UserSerializer


# ===========================================
# 🔐 AUTHENTICATION
# ===========================================

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirmPassword")

        if not username or not email or not password:
            return Response({"error": "All fields are required."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=400)

        try:
            User.objects.create(
                username=username,
                email=email,
                password=make_password(password)
            )
            return Response({"message": "User created successfully."}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("username")
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"error": "Username/email and password are required."}, status=400)

        user = User.objects.filter(username=identifier).first() or \
               User.objects.filter(email=identifier).first()

        if user and check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "Login successful."
            }, status=200)

        return Response({"error": "Invalid credentials."}, status=401)


# ===========================================
# 👤 PROFILE
# ===========================================

def get_ordinal(n):
    return f"{n}{'th' if 11 <= n <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')}"


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        joined = user.date_joined
        formatted_joined = f"{get_ordinal(joined.day)} {joined.strftime('%B %Y')}"

        enrolled_lessons = Lesson.objects.filter(enrollments__user=user).distinct()

        courses = [
            {
                "title": lesson.title,
                "icon": request.build_absolute_uri(lesson.icon.url) if lesson.icon else None
            }
            for lesson in enrolled_lessons
        ]

        return Response({
            "name": user.first_name or user.username,
            "username": user.username,
            "joined": formatted_joined,
            "courses": courses
        })


# ===========================================
# 🛠️ ADMIN DASHBOARD
# ===========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_staff:
        return Response({"error": "Admin access only."}, status=403)

    data = {
        "totalUsers": User.objects.count(),
        "totalCourses": Lesson.objects.count(),
        "totalEnrollments": Enrollment.objects.count(),
        "completionRate": 85,
        "activityLogs": [
            {"date": "2024-03-01", "action": "User signed up", "user": "JohnDoe"},
            {"date": "2024-03-02", "action": "Lesson added", "user": "Admin"},
        ],
        "latestReviews": Review.objects.values("rating", "comment")[:5]
    }

    return Response(data)


# ===========================================
# 👥 USER MANAGEMENT (Admin only)
# ===========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                is_staff=serializer.validated_data.get('is_staff', False)
            )
            return Response({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user.username = serializer.validated_data.get('username', user.username)
        user.email = serializer.validated_data.get('email', user.email)
        user.is_staff = serializer.validated_data.get('is_staff', user.is_staff)

        if 'password' in serializer.validated_data:
            user.set_password(serializer.validated_data['password'])

        user.save()
        return Response({'message': 'User updated successfully'})
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
