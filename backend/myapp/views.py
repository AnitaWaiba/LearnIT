from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Lesson, Enrollment, Review
from .serializers import UserSerializer  # ✅ Make sure this is implemented!


# =====================================================
# ✅ Signup
# =====================================================
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response(
                {"error": "Username, email, and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            User.objects.create(
                username=username,
                email=email,
                password=make_password(password)
            )
            return Response(
                {"message": "User created successfully."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =====================================================
# ✅ Login (JWT Token)
# =====================================================
class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("username")  # Could be username or email
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {"error": "Username/email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(username=identifier).first() or \
               User.objects.filter(email=identifier).first()

        if user and check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "Login successful."
            }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )


# =====================================================
# ✅ Admin Dashboard (Basic Example)
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_staff:
        return Response(
            {"error": "Unauthorized. Admin access only."},
            status=status.HTTP_403_FORBIDDEN
        )

    data = {
        "totalUsers": User.objects.count(),
        "totalCourses": Lesson.objects.count(),
        "totalEnrollments": Enrollment.objects.count(),
        "completionRate": 85,  # Example
        "activityLogs": [
            {"date": "2024-03-01", "action": "User signed up", "user": "JohnDoe"},
            {"date": "2024-03-02", "action": "Lesson added", "user": "Admin"},
        ],
        "latestReviews": Review.objects.values("rating", "comment")[:5]
    }

    return Response(data, status=status.HTTP_200_OK)


# =====================================================
# ✅ User Management CRUD (Admin Only)
# =====================================================

# 🔹 GET all users
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# 🔹 CREATE a new user
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_user(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        try:
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            user.is_staff = serializer.validated_data.get('is_staff', False)
            user.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 UPDATE an existing user
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user.username = serializer.validated_data.get('username', user.username)
        user.email = serializer.validated_data.get('email', user.email)
        user.is_staff = serializer.validated_data.get('is_staff', user.is_staff)

        if 'password' in serializer.validated_data and serializer.validated_data['password']:
            user.set_password(serializer.validated_data['password'])

        try:
            user.save()
            return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 DELETE a user
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
