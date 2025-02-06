from django.db import models
from django.contrib.auth.models import User


class Lesson(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.username} enrolled in {self.lesson.title}"


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
