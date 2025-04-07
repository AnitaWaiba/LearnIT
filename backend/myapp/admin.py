from django.contrib import admin
from .models import Lesson, UserProfile

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user']
    filter_horizontal = ('courses',)  # 👈 enables dual list box UI
