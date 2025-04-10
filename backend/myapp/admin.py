from django.contrib import admin
from .models import Lesson, Question, Option, UserProfile

# 🔸 Inline for Options under a Question
class OptionInline(admin.TabularInline):
    model = Option
    extra = 3

# 🔸 Inline for Questions under a Lesson
class QuestionInline(admin.StackedInline):
    model = Question
    extra = 2

# 🔹 Register Lesson with inlined Questions
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    inlines = [QuestionInline]

# 🔹 Register Question separately (in case you want to manage them individually too)
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'type', 'lesson']
    inlines = [OptionInline]

# 🔹 Register Option separately (optional)
@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['text', 'question', 'is_correct']

# 🔹 Register UserProfile with enrolled courses
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user']
    
    # ✅ This assumes `UserProfile.courses = models.ManyToManyField(Lesson)`
    filter_horizontal = ('courses',)
