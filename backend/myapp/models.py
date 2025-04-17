from django.db import models
from django.contrib.auth.models import User

# ===========================================
# ✅ Course MODEL
# ===========================================
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    icon = models.ImageField(upload_to='course_icons/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class CourseLevel(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('some', 'Some Knowledge'),
        ('pro', 'Professional'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)

    class Meta:
        unique_together = ('user', 'course')

# ===========================================
# ✅ Lesson MODEL
# ===========================================
class Lesson(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('some', 'Some Knowledge'),
        ('pro', 'Professional'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    min_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')  # ✅ Required!
    created_at = models.DateTimeField(auto_now_add=True)

    # 🆕 Add this field to filter which level should see this lesson
    min_level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='beginner',
        help_text="Minimum user level required to access this lesson"
    )

    def __str__(self):
        return f"{self.title} ({self.course.title})"

# ===========================================
# ✅ Lesson Progress MODEL
# ===========================================
class UserLessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        
class LessonCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')

# ===========================================
# ✅ QUESTION MODEL (MCQ, Fill, Match, Image)
# ===========================================
class Question(models.Model):
    QUESTION_TYPES = [
        ('mcq', 'Multiple Choice'),
        ('fill', 'Fill in the Blank'),
        ('match', 'Matching'),
        ('image', 'Image Based'),
    ]

    lesson = models.ForeignKey('Lesson', on_delete=models.CASCADE, related_name='questions')
    type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    text = models.TextField()
    image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    hint = models.TextField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.type.upper()}: {self.text}"


# ===========================================
# ✅ OPTION MODEL (supports MCQ + Matching)
# ===========================================
class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)  # For MCQ
    match_pair = models.CharField(max_length=255, blank=True, null=True)  # For Matching

    def __str__(self):
        return self.text

# ===========================================
# ✅ Lesson MODEL
# ===========================================
class LessonBlock(models.Model):
    BLOCK_TYPES = [
        ('text', 'Text'),
        ('question', 'Question'),
    ]

    lesson = models.ForeignKey('Lesson', on_delete=models.CASCADE, related_name='blocks')
    type = models.CharField(max_length=10, choices=BLOCK_TYPES)
    order = models.PositiveIntegerField()
    text = models.TextField(blank=True, null=True)
    question = models.ForeignKey('Question', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.type.upper()} Block #{self.order}"


# ===========================================
# ✅ USER PROFILE MODEL
# ===========================================
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    courses = models.ManyToManyField(Course, related_name='user_profiles')
    
    # 🆕 Fields
    xp = models.IntegerField(default=0)
    hearts = models.IntegerField(default=5)
    last_heart_refill = models.DateTimeField(null=True, blank=True)
    current_streak = models.IntegerField(default=0)
    last_completed_date = models.DateField(null=True, blank=True)
    total_xp = models.IntegerField(default=0)


    def __str__(self):
        return f"{self.user.username} Profile"


# ===========================================
# ✅ ENROLLMENT MODEL
# ===========================================
class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"

# ===========================================
# ✅ REVIEW MODEL
# ===========================================
class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} on {self.course.title} ({self.rating}/5)"

# ===========================================
# ✅ Quest MODEL
# ===========================================
class DailyQuest(models.Model):
    QUEST_TYPES = [
        ('xp', 'Earn XP'),
        ('streak', 'Correct in a Row'),
        ('accuracy', 'High Accuracy'),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=QUEST_TYPES)
    target = models.IntegerField()
    reward_xp = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.title} ({self.type})"

class UserDailyQuest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quest = models.ForeignKey(DailyQuest, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    date_assigned = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quest', 'date_assigned')
