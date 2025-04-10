from django.db import models
from django.contrib.auth.models import User

# ===========================================
# ✅ LESSON MODEL (with icon and question support)
# ===========================================
class Lesson(models.Model):
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

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    text = models.TextField()
    image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    hint = models.TextField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.type.upper()}: {self.text}"


# ===========================================
# ✅ OPTION MODEL
# ===========================================
class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)  # For MCQ
    match_pair = models.CharField(max_length=255, blank=True, null=True)  # For Matching

    def __str__(self):
        return self.text


# ===========================================
# ✅ USER PROFILE MODEL
# ===========================================
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    courses = models.ManyToManyField(Lesson, related_name='user_profiles')
    current_streak = models.PositiveIntegerField(default=0)
    last_completed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"


# ===========================================
# ✅ ENROLLMENT MODEL
# ===========================================
class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.username} enrolled in {self.lesson.title}"


# ===========================================
# ✅ REVIEW MODEL
# ===========================================
class Review(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} on {self.lesson.title} ({self.rating}/5)"
