from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import re, traceback

from .models import UserProfile, Course, Lesson, Question, Option, Enrollment, Review, LessonBlock, UserLessonProgress
from .serializers import (
    UserSerializer, CourseSerializer, LessonSerializer,
    CourseDetailSerializer, LessonDetailSerializer, QuestionSerializer, LessonBlockSerializer
)

# ---------------- AUTH ----------------
@method_decorator(csrf_exempt, name='dispatch')
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

        # 🔐 Password strength rule
        password_regex = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(password_regex, password):
            return Response({
                "error": "Password must be at least 8 characters long and include letters, numbers, and special characters."
            }, status=400)
        
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return Response({"message": "User created successfully."}, status=201)

@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        identifier = request.data.get("username")
        password = request.data.get("password")
        if not identifier or not password:
            return Response({"error": "Username and password are required."}, status=400)
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
def get_day_suffix(day):
    if 11 <= day <= 13:
        return 'th'
    return {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            print("🧑 USER:", user)

            joined = user.date_joined
            print("📅 Joined:", joined)
            suffix = get_day_suffix(joined.day)
            formatted_joined = f"{joined.day}{suffix} {joined.strftime('%B %Y')}"

            enrolled_courses = Course.objects.filter(course_enrollments__user=user).distinct()
            print("📘 Enrolled courses count:", enrolled_courses.count())

            courses = []
            for course in enrolled_courses:
                print("➡️ Course:", course.title)
                try:
                    if course.icon and hasattr(course.icon, 'url'):
                        icon_url = request.build_absolute_uri(course.icon.url)
                    else:
                        icon_url = None
                except Exception as e:
                    print(f"⚠️ ICON LOAD FAILED for '{course.title}':", e)
                    icon_url = None

                courses.append({
                    "title": course.title,
                    "icon": icon_url
                })

            profile, _ = UserProfile.objects.get_or_create(user=user)
            return Response({
                "name": user.first_name or user.username,
                "username": user.username,
                "joined": formatted_joined,
                "avatar": request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
                "courses": courses
            })

        except Exception as e:
            print("🔥 CRITICAL PROFILE ERROR:")
            traceback.print_exc()  # 👈 shows full Python error in terminal
            return Response({"error": "Internal Server Error", "details": str(e)}, status=500)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_credentials(request):
    user = request.user
    profile = user.profile

    data = request.data
    avatar = request.FILES.get('avatar')

    username = data.get("username")
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    # ✅ Handle avatar upload
    if avatar:
        profile.avatar = avatar
        profile.save()

    # ✅ Optional credential update block
    if any([username, current_password, new_password]):
        if not all([username, current_password, new_password]):
            return Response({"error": "All credential fields are required."}, status=400)

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=400)

        if User.objects.filter(username=username).exclude(pk=user.pk).exists():
            return Response({"error": "Username is already taken."}, status=400)

        user.username = username
        user.set_password(new_password)
        user.save()

    return Response({
        "message": "Profile updated successfully.",
        "avatar": profile.avatar.url if profile.avatar else None
    })

# ---------------- COURSES ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):
    title = request.data.get("title")
    description = request.data.get("description", "")
    content = request.data.get("content", "")
    icon = request.FILES.get("icon")
    if not title:
        return Response({"error": "Title is required"}, status=400)

    course = Course.objects.create(
        title=title,
        description=description,
        content=content,
        icon=icon
    )
    return Response({"message": "Course created successfully"}, status=201)


# ---------------- LESSONS ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons_by_course(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    lessons = Lesson.objects.filter(course=course)
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lesson(request):
    course_id = request.data.get("course_id")
    title = request.data.get("title")
    content = request.data.get("content")

    if not all([course_id, title]):
        return Response({"error": "Course and title are required"}, status=400)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Invalid course"}, status=404)

    Lesson.objects.create(course=course, title=title, content=content)
    return Response({"message": "Lesson created successfully"}, status=201)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=404)

    lesson.title = request.data.get("title", lesson.title)
    lesson.content = request.data.get("content", lesson.content)
    lesson.save()
    return Response({"message": "Lesson updated successfully"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
        lesson.delete()
        return Response({"message": "Lesson deleted successfully"})
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_blocks(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

    blocks = LessonBlock.objects.filter(lesson=lesson).select_related('question').prefetch_related('question__options')
    serializer = LessonBlockSerializer(blocks, many=True)
    return Response({
        "lesson": LessonSerializer(lesson).data,
        "blocks": serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_paragraph_to_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=404)

    block_type = request.data.get("type")  # 'text' or 'question'
    order = request.data.get("order")
    text = request.data.get("text", "")
    question_id = request.data.get("question_id")

    if block_type not in ['text', 'question']:
        return Response({"error": "Invalid block type"}, status=400)

    block = LessonBlock.objects.create(
        lesson=lesson,
        type=block_type,
        order=order,
        text=text if block_type == 'text' else None,
        question_id=question_id if block_type == 'question' else None
    )
    return Response({"message": "Lesson block created", "block_id": block.id}, status=201)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_paragraph_by_id(request, block_id):
    try:
        block = LessonBlock.objects.get(pk=block_id)
    except LessonBlock.DoesNotExist:
        return Response({"error": "Block not found"}, status=404)

    block.type = request.data.get("type", block.type)
    block.order = request.data.get("order", block.order)
    block.text = request.data.get("text", block.text)
    block.question_id = request.data.get("question_id", block.question_id)
    block.save()

    return Response({"message": "Lesson block updated"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_paragraph_by_id(request, block_id):
    try:
        block = LessonBlock.objects.get(pk=block_id)
        block.delete()
        return Response({"message": "Lesson block deleted"})
    except LessonBlock.DoesNotExist:
        return Response({"error": "Block not found"}, status=404)

# ---------------- QUESTIONS ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_question_to_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

    question_text = request.data.get("text")
    question_type = request.data.get("type")
    hint = request.data.get("hint", "")
    explanation = request.data.get("explanation", "")
    options_data = request.data.get("options", [])

    if not question_text or not question_type:
        return Response({"error": "Text and Type are required."}, status=400)

    question = Question.objects.create(
        lesson=lesson,
        text=question_text,
        type=question_type,
        hint=hint,
        explanation=explanation
    )

    if question_type == "mcq":
        for opt in options_data:
            question.options.create(
                text=opt.get("text", ""),
                is_correct=opt.get("is_correct", False)
            )
    elif question_type == "fill":
        question.options.create(text=options_data[0].get("text", ""), is_correct=True)
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
        return Response({"error": "Lesson not found."}, status=404)

    questions = Question.objects.filter(lesson=lesson).prefetch_related("options")
    serializer = QuestionSerializer(questions, many=True)
    return Response({
        "lesson": LessonSerializer(lesson).data,
        "questions": serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_lesson_completed(request, lesson_id):
    user = request.user
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        progress, created = UserLessonProgress.objects.get_or_create(user=user, lesson=lesson)
        progress.completed = True
        progress.save()
        return Response({"message": "Lesson marked as completed."})
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_lessons(request, course_id):
    user = request.user
    completed_lesson_ids = UserLessonProgress.objects.filter(
        user=user,
        lesson__course_id=course_id,
        completed=True
    ).values_list('lesson_id', flat=True)
    return Response(list(completed_lesson_ids))

# ---------------- ENROLLMENT ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_course(request, course_id):
    user = request.user
    try:
        course = Course.objects.get(id=course_id)
        Enrollment.objects.get_or_create(user=user, course=course)
        return Response({"message": f"Enrolled in {course.title}"}, status=200)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    

# ---------------- ADMIN ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_staff:
        return Response({"error": "Admin access only."}, status=403)
    data = {
        "totalUsers": User.objects.count(),
        "totalCourses": Course.objects.count(),
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
