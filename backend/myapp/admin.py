from django.contrib import admin
from .models import (
    Course, Lesson, Question, Option,
    UserProfile, UserLessonProgress, CourseLevel
)

# 🔸 Inline for Options under a Question
class OptionInline(admin.TabularInline):
    model = Option
    extra = 2

# 🔸 Inline for Questions under a Lesson
class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1

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

# 🔹 Question Admin with inline Options
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'type', 'lesson']
    inlines = [OptionInline]

# 🔹 Option Admin
@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['text', 'question', 'is_correct', 'match_pair']

# 🔹 User Profile Admin
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'avatar', 'current_streak']
    fields = ['user', 'avatar', 'courses', 'current_streak']
    filter_horizontal = ('courses',)

# 🔹 User Lesson Progress Admin
@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed', 'completed_at']
    list_filter = ['completed']

# 🔹 Course Level Admin
@admin.register(CourseLevel)
class CourseLevelAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'level']
    list_filter = ['level']
    search_fields = ['user__username', 'course__title']
