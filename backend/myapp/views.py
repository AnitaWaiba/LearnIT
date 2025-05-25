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
import random
from datetime import date, timedelta
from django.utils import timezone
from django.utils.html import escape
from .tokens import email_verification_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes, force_str

from .models import (UserProfile, Course, Lesson, Question, Option, Enrollment, Review, 
                     LessonBlock, UserLessonProgress, CourseLevel, DailyQuest, UserDailyQuest, Notification)
from .serializers import (
    UserSerializer, CourseSerializer, LessonSerializer,
    CourseDetailSerializer, LessonDetailSerializer, QuestionSerializer, LessonBlockSerializer, DailyQuestSerializer, UserDailyQuestSerializer,
    NotificationSerializer,
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

        # ✅ Validate input fields
        if not all([username, email, password, confirm_password]):
            return Response({"error": "All fields are required."}, status=400)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=400)

        # ✅ Enforce strong password policy
        password_regex = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(password_regex, password):
            return Response({
                "error": "Password must be at least 8 characters long and include letters, numbers, and special characters."
            }, status=400)

        # ✅ Create user and profile
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )

        # ✅ Send verification email
        send_verification_email(request, user)

        return Response({"message": "User created. Check email for verification."}, status=201)
    

@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("username")
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"error": "Username and password are required."}, status=400)

        user = User.objects.filter(username=identifier).first() or User.objects.filter(email=identifier).first()

        if not user or not check_password(password, user.password):
            return Response({"error": "Invalid credentials."}, status=401)

        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found. Please contact support."}, status=500)

        if not profile.is_verified:
            return Response({"error": "Email not verified. Please check your inbox or resend the verification email."}, status=403)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "message": "Login successful."
        }, status=200)
    

def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verify_url = request.build_absolute_uri(reverse('verify-email', args=[uid, token]))
    try:
        send_mail(
            'Verify Your LearnIT Account',
            f'Hi {user.username},\n\nClick the link to verify your account:\n{verify_url}\n\nThanks!',
            'no-reply@learnit.com',
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        # Optionally log error or notify admins


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()  # This can throw error
        user = User.objects.get(pk=uid)
    except Exception:
        return Response({"error": "Invalid verification link"}, status=400)

    if default_token_generator.check_token(user, token):
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.is_verified = True
        profile.save()
        return Response({"message": "✅ Email verified successfully!"})
    else:
        return Response({"error": "Verification link expired or invalid."}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
        profile = UserProfile.objects.get(user=user)
        if profile.is_verified:
            return Response({"message": "Account already verified"}, status=200)

        send_verification_email(request, user)
        return Response({"message": "Verification email resent."})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)
    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_base_url = "http://localhost:3000"  # or your production frontend domain
        reset_url = f"{frontend_base_url}/reset-password/{uid}/{token}/"
        send_mail(
            'Reset Your LearnIT Password',
            f'Click to reset your password: {reset_url}',
            'no-reply@learnit.com',
            [user.email],
            fail_silently=False,
        )
        return Response({"message": "Password reset email sent."})
    except User.DoesNotExist:
        return Response({"error": "User with that email not found"}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except Exception:
        return Response({"error": "Invalid reset link"}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)

    password = request.data.get("password")
    if not password:
        return Response({"error": "Password is required"}, status=400)

    user.set_password(password)
    user.save()
    return Response({"message": "Password reset successful!"})

    
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
            joined = user.date_joined
            suffix = get_day_suffix(joined.day)
            formatted_joined = f"{joined.day}{suffix} {joined.strftime('%B %Y')}"

            enrolled_courses = Course.objects.filter(course_enrollments__user=user).distinct()

            courses = []
            for course in enrolled_courses:
                try:
                    icon_url = request.build_absolute_uri(course.icon.url) if course.icon and hasattr(course.icon, 'url') else None
                except Exception:
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
                "courses": courses,

                # ✅ New additions
                "xp": profile.total_xp,
                "hearts": profile.hearts,
                "current_streak": profile.current_streak,
            })

        except Exception as e:
            print("🔥 CRITICAL PROFILE ERROR:")
            traceback.print_exc()
            return Response({"error": "Internal Server Error", "details": str(e)}, status=500)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_credentials(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

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

class SetUserCourseLevel(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get('course_id')
        level = request.data.get('level')

        if not course_id or not level:
            return Response({'error': 'Missing course_id or level'}, status=400)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)

        obj, created = CourseLevel.objects.update_or_create(
            user=request.user,
            course=course,
            defaults={'level': level}
        )

        return Response({'status': 'success', 'level': obj.level})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_course_level(request, course_id):
    user = request.user
    try:
        course = Course.objects.get(id=course_id)
        entry = CourseLevel.objects.filter(user=user, course=course).first()
        return Response({
            "course": course.title,
            "level": entry.level if entry else None
        })
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

# ---------------- LESSONS ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons_by_course(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    # Get the user's level for this course
    try:
        course_level = CourseLevel.objects.get(user=request.user, course=course).level
    except CourseLevel.DoesNotExist:
        course_level = 'beginner'  # default fallback

    # Order of levels
    level_order = ['beginner', 'some', 'pro']
    level_index = level_order.index(course_level)

    # Filter lessons based on user level and above
    lessons = Lesson.objects.filter(course=course, min_level__in=level_order[level_index:]).order_by('id')
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lesson(request):
    course_id = request.data.get("course_id")
    title = request.data.get("title")
    content = request.data.get("content")
    min_level = request.data.get("min_level", "beginner")

    if not all([course_id, title]):
        return Response({"error": "Course and title are required"}, status=400)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Invalid course"}, status=404)

    Lesson.objects.create(
        course=course,
        title=title,
        content=content,
        min_level=min_level
    )
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
    lesson.min_level = request.data.get("min_level", lesson.min_level)
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
    profile, _ = UserProfile.objects.get_or_create(user=user)
    now = timezone.now()
    today = now.date()

    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

    # Prevent duplicate completions
    progress, created = UserLessonProgress.objects.get_or_create(user=user, lesson=lesson)
    if progress.completed:
        return Response({"message": "Already completed."})

    # ✅ Update progress
    progress.completed = True
    progress.completed_at = now
    progress.save()

    # ✅ Update streak
    if profile.last_completed_date == today - timezone.timedelta(days=1):
        profile.current_streak += 1
    elif profile.last_completed_date != today:
        profile.current_streak = 1  # restart streak
    profile.last_completed_date = today

    # ✅ Award XP
    base_xp = 10
    streak_bonus = 5 if profile.current_streak >= 3 else 0
    profile.total_xp += base_xp + streak_bonus

    # ✅ Refill hearts every 24 hours
    if now - profile.last_heart_refill > timezone.timedelta(hours=24):
        profile.hearts = 5
        profile.last_heart_refill = now

    create_notification(user, "❤️ Your hearts have been refilled. Keep learning!")

    quests = UserDailyQuest.objects.filter(user=user, date_assigned=today, completed=False)

    for q in quests:
        if q.quest.type == 'xp':
            q.progress += base_xp + streak_bonus
        elif q.quest.type == 'streak':
            q.progress = profile.current_streak

        if q.progress >= q.quest.target:
            q.completed = True
        q.save()

    profile.save()
    update_leaderboard_and_notify()


    return Response({
        "message": "Lesson completed 🎉",
        "xp_awarded": base_xp + streak_bonus,
        "current_streak": profile.current_streak,
        "total_xp": profile.total_xp,
        "hearts": profile.hearts,
    })

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    answer = request.data.get("answer")
    profile = request.user.profile
    now = timezone.now()
    today = now.date()

    # ✅ Refill hearts if needed
    if not profile.last_heart_refill or (now - profile.last_heart_refill > timedelta(hours=24)):
        profile.hearts = 5
        profile.last_heart_refill = now

    correct = False

    # ✅ Validate answer
    if question.type == "mcq":
        correct = question.options.filter(text=answer, is_correct=True).exists()
    elif question.type == "fill":
        correct_answer = question.options.filter(is_correct=True).first()
        if correct_answer:
            correct = answer.strip().lower() == correct_answer.text.strip().lower()
    elif question.type == "match":
        correct = True  # Future: validate match structure
    else:
        return Response({"error": "Unsupported question type"}, status=400)

    # ✅ On correct answer: add XP
    if correct:
        profile.total_xp += 2

        # 🔁 Update quest progress
        quests = UserDailyQuest.objects.filter(user=request.user, date_assigned=today, completed=False)
        for q in quests:
            if q.quest.type == 'xp':
                q.progress += 2
            elif q.quest.type == 'accuracy':
                q.progress += 1
            if q.progress >= q.quest.target:
                q.completed = True
            q.save()

    # ❌ On wrong: lose 1 heart
    else:
        if profile.hearts > 0:
            profile.hearts -= 1
        else:
            return Response({"error": "Out of hearts"}, status=400)

    profile.save()
    update_leaderboard_and_notify()


    return Response({
        "correct": correct,
        "xp": profile.total_xp,
        "hearts": profile.hearts,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decrease_heart(request):
    profile = request.user.profile
    if profile.hearts > 0:
        profile.hearts -= 1
        profile.save()
        return Response({"hearts": profile.hearts})
    return Response({"error": "No hearts remaining."}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_status_info(request):
    profile = request.user.profile
    return Response({
        "xp": profile.total_xp,
        "hearts": profile.hearts,
        "streak": profile.current_streak
    })

def refill_hearts_if_needed(profile):
    today = date.today()

    if profile.hearts < 5:
        if not profile.last_heart_refill or profile.last_heart_refill < today:
            profile.hearts = 5
            profile.last_heart_refill = today
            profile.save()

# ---------------- ENROLLMENT ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_course(request, course_id):
    user = request.user
    try:
        course = Course.objects.get(id=course_id)
        enrollment, created = Enrollment.objects.get_or_create(user=user, course=course)

        if created:
            create_notification(user, f"🎉 You have successfully enrolled in the course: {course.title}")

        level_entry = CourseLevel.objects.filter(user=user, course=course).first()
        return Response({
            "message": f"Enrolled in {course.title}",
            "level": level_entry.level if level_entry else None
        }, status=200)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)    

# ---------------- ADMIN ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_staff:
        return Response({"error": "Admin access only."}, status=403)

    # 📊 Course-wise Enrollment Count for Pie Chart
    course_labels = []
    course_counts = []
    all_courses = Course.objects.all()
    for course in all_courses:
        course_labels.append(course.title)
        course_counts.append(Enrollment.objects.filter(course=course).count())

    data = {
        "totalUsers": User.objects.count(),
        "totalCourses": all_courses.count(),
        "totalEnrollments": Enrollment.objects.count(),
        "completionRate": 85,  # Optionally calculate real completion rate
        "courseStats": {
            "labels": course_labels,
            "counts": course_counts,
        },
        "activityLogs": [
            {"date": "2024-03-01", "action": "User signed up", "user": "JohnDoe"},
            {"date": "2024-03-04", "action": "Enrolled in Course", "user": "JaneSmith"},
        ],
        "latestReviews": list(Review.objects.values("rating", "comment").order_by("-id")[:5])
    }

    return Response(data)

# ------------------ USER: GET DAILY QUESTS ------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_daily_quests(request):
    user = request.user
    today = timezone.now().date()

    # Only assign if none already assigned today
    if not UserDailyQuest.objects.filter(user=user, date_assigned=today).exists():
        types = ['xp', 'streak', 'accuracy']
        for quest_type in types:
            quest = DailyQuest.objects.filter(type=quest_type).order_by('?').first()
            if quest:
                UserDailyQuest.objects.create(user=user, quest=quest)

    quests = UserDailyQuest.objects.filter(user=user, date_assigned=today).select_related('quest')

    data = [
        {
            'id': q.id,
            'title': q.quest.title,
            'type': q.quest.type,
            'target': q.quest.target,
            'progress': q.progress,
            'completed': q.completed,
            'reward_xp': q.quest.reward_xp,
        }
        for q in quests
    ]

    return Response(data)

# ------------------ ADMIN: LIST + CREATE ------------------
class ListQuestView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        quests = DailyQuest.objects.all()
        serializer = DailyQuestSerializer(quests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DailyQuestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------ ADMIN: UPDATE QUEST ------------------
class UpdateQuestView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            quest = DailyQuest.objects.get(pk=pk)
        except DailyQuest.DoesNotExist:
            return Response({'error': 'Quest not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DailyQuestSerializer(quest, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '✅ Quest updated', 'quest': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------ ADMIN: DELETE QUEST ------------------
class DeleteQuestView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            quest = DailyQuest.objects.get(pk=pk)
            quest.delete()
            return Response({'message': '🗑️ Quest deleted'}, status=status.HTTP_204_NO_CONTENT)
        except DailyQuest.DoesNotExist:
            return Response({'error': 'Quest not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_leaderboard(request):
    top_users = UserProfile.objects.select_related('user').order_by('-total_xp')[:100]

    result = []
    for profile in top_users:
        user = profile.user
        avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None

        result.append({
            "username": escape(user.username),
            "name": escape(user.first_name or user.username),
            "xp": profile.total_xp,
            "avatar": avatar_url,
        })

    return Response(result)

def update_leaderboard_and_notify():
    print("📊 Running leaderboard update...")

    profiles = list(UserProfile.objects.select_related('user').order_by('-total_xp'))
    
    for idx, profile in enumerate(profiles):
        current_rank = idx + 1
        previous_rank = profile.last_rank

        print(f"🔍 Checking user {profile.user.username}: current={current_rank}, previous={previous_rank}")

        # Notify only if rank changed
        if previous_rank is not None:
            if current_rank < previous_rank:
                print(f"📢 {profile.user.username} climbed to {current_rank}")
                create_notification(profile.user, f"⬆️ You've climbed to Rank {current_rank} on the leaderboard!")
            elif current_rank > previous_rank:
                print(f"📉 {profile.user.username} dropped to {current_rank}")
                create_notification(profile.user, f"⬇️ You've dropped to Rank {current_rank} on the leaderboard.")

        # Update stored rank
        profile.last_rank = current_rank
        profile.save()


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

def create_notification(user, message):
    print(f"✅ Creating notification for {user.username}: {message}")
    Notification.objects.create(user=user, message=message)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({"message": "Notification marked as read."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=404)