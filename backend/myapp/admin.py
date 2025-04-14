from django.contrib import admin
from .models import Course, Lesson, Question, Option, UserProfile

# 🔸 Inline for Options under a Question
class OptionInline(admin.TabularInline):
    model = Option
    extra = 2

# 🔸 Inline for Questions under a Lesson
class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1
    inlines = [OptionInline]

# 🔸 Inline for Lessons under a Course
class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 1

# 🔹 Course Admin with inline Lessons
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    inlines = [LessonInline]

# 🔹 Lesson Admin with inline Questions
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'created_at']
    inlines = [QuestionInline]

# 🔹 Register Question (optional standalone view)
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'type', 'lesson']
    inlines = [OptionInline]

# 🔹 Register Option (optional standalone view)
@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['text', 'question', 'is_correct', 'match_pair']

# 🔹 UserProfile Admin with enrolled courses
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak']
    filter_horizontal = ('courses',)  # ✅ Now points to Course model
