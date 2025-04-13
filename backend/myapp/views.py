from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, Lesson, Enrollment, Review, Question
from .serializers import UserSerializer, LessonSerializer, QuestionSerializer

# ---------------- AUTH ----------------
class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirmPassword")

        if not all([username, email, password, confirm_password]):
            return Response({"error": "All fields are required."}, status=400)
        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=400)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return Response({"message": "User created successfully."}, status=201)


class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        identifier = request.data.get("username")
        password = request.data.get("password")
        if not identifier or not password:
            return Response({"error": "Username/email and password are required."}, status=400)
        user = User.objects.filter(username=identifier).first() or User.objects.filter(email=identifier).first()
        if user and check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "Login successful."
            }, status=200)
        return Response({"error": "Invalid credentials."}, status=401)


# ---------------- PROFILE ----------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        joined = user.date_joined
        formatted_joined = f"{joined.day}{['th', 'st', 'nd', 'rd'][min(joined.day % 10, 3)]} {joined.strftime('%B %Y')}"
        enrolled_lessons = Lesson.objects.filter(enrollments__user=user).distinct()
        courses = [
            {"title": l.title, "icon": request.build_absolute_uri(l.icon.url) if l.icon else None}
            for l in enrolled_lessons
        ]
        return Response({
            "name": user.first_name or user.username,
            "username": user.username,
            "joined": formatted_joined,
            "courses": courses
        })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_credentials(request):
    user = request.user
    data = request.data
    username = data.get("username")
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    if not all([username, current_password, new_password]):
        return Response({"error": "All fields are required."}, status=400)
    if not user.check_password(current_password):
        return Response({"error": "Current password is incorrect."}, status=400)
    if User.objects.filter(username=username).exclude(pk=user.pk).exists():
        return Response({"error": "Username is already taken."}, status=400)
    user.username = username
    user.set_password(new_password)
    user.save()
    return Response({"message": "Profile updated successfully."})


# ---------------- LESSONS ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_lessons(request):
    lessons = Lesson.objects.all()
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lesson(request):
    parser_classes = (MultiPartParser, FormParser)
    title = request.data.get("title")
    description = request.data.get("description", "")
    content = request.data.get("content", "")
    icon = request.FILES.get("icon")
    if not title:
        return Response({"error": "Title is required."}, status=400)
    lesson = Lesson.objects.create(title=title, description=description, content=content, icon=icon)
    return Response({"message": "Lesson created successfully."}, status=201)


# ---------------- QUESTIONS ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_question_to_lesson(request, lesson_id):  # ✅ accept lesson_id
    try:
        lesson = Lesson.objects.get(id=lesson_id)  # ✅ use from URL, not request.data
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

    question_text = request.data.get("text")
    question_type = request.data.get("type")
    hint = request.data.get("hint", "")
    explanation = request.data.get("explanation", "")
    options_data = request.data.get("options", [])

    if not question_text or not question_type:
        return Response({"error": "Text and Type are required."}, status=400)

    # Create the question
    question = Question.objects.create(
        lesson=lesson,
        text=question_text,
        type=question_type,
        hint=hint,
        explanation=explanation
    )

    # Create associated options
    if question_type == "mcq":
        for opt in options_data:
            question.options.create(
                text=opt.get("text", ""),
                is_correct=opt.get("is_correct", False)
            )
    elif question_type == "fill":
        question.options.create(
            text=options_data[0].get("text", ""),
            is_correct=True
        )
    elif question_type == "match":
        for opt in options_data:
            question.options.create(
                text=opt.get("text", ""),
                match_pair=opt.get("match_pair", "")
            )

    return Response({"message": "✅ Question added successfully."}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_questions(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

    questions = Question.objects.filter(lesson=lesson).prefetch_related("options")
    serializer = QuestionSerializer(questions, many=True)

    return Response({
        "lesson": LessonSerializer(lesson).data,
        "questions": serializer.data
    }, status=status.HTTP_200_OK)

# ---------------- ENROLLMENT ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_lesson(request, lesson_id):
    user = request.user
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        Enrollment.objects.get_or_create(user=user, lesson=lesson)
        return Response({"message": f"Enrolled in {lesson.title}"}, status=200)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)


# ---------------- ADMIN ----------------
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
        "activityLogs": [{"date": "2024-03-01", "action": "User signed up", "user": "JohnDoe"}],
        "latestReviews": Review.objects.values("rating", "comment")[:5]
    }
    return Response(data)


# ---------------- USER MANAGEMENT ----------------
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
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            is_staff=serializer.validated_data.get('is_staff', False)
        )
        return Response({'message': 'User created successfully'}, status=201)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_questions(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

    questions = Question.objects.filter(lesson=lesson)
    serializer = QuestionSerializer(questions, many=True)
    return Response({
        "lesson": LessonSerializer(lesson).data,
        "questions": serializer.data
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_question_by_id(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    question.text = request.data.get("text", question.text)
    question.type = request.data.get("type", question.type)
    question.hint = request.data.get("hint", question.hint)
    question.explanation = request.data.get("explanation", question.explanation)
    question.save()

    # Replace options
    options_data = request.data.get("options", [])
    question.options.all().delete()

    for opt in options_data:
        question.options.create(
            text=opt.get("text"),
            is_correct=opt.get("is_correct", False),
            match_pair=opt.get("match_pair", "")
        )

    return Response({"message": "Question updated successfully"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_question_by_id(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
        question.delete()
        return Response({"message": "Question deleted"})
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)
