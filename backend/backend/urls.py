from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

from myapp import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    # 🔧 Admin Panel
    path('admin/', admin.site.urls),

    # ✅ Root API Status
    path('', lambda request: HttpResponse("✅ Django API is running")),

    # 🔐 Auth
    path('api/signup/', views.SignupView.as_view(), name='signup'),
    path('api/login/', views.CustomLoginView.as_view(), name='login'),

    # 🔑 JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 👤 Profile
    path('api/profile/', views.ProfileView.as_view(), name='user_profile'),
    path('api/profile/update/', views.update_profile_credentials, name='update_profile_credentials'),

    # 🛠️ Admin Dashboard & User Management
    path('api/admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('api/admin/users/', views.list_users, name='list_users'),
    path('api/admin/users/create/', views.create_user, name='create_user'),
    path('api/admin/users/<int:user_id>/update/', views.update_user, name='update_user'),
    path('api/admin/users/<int:user_id>/delete/', views.delete_user, name='delete_user'),

    # 📘 Lessons & Questions
    path('api/lessons/create/', views.create_lesson, name='create_lesson'),
    path('api/lessons/', views.get_all_lessons, name='get_all_lessons'),  # ✅ used for dropdown
    path('api/lessons/<int:lesson_id>/questions/', views.get_lesson_questions, name='lesson_questions'),
    path('api/lessons/<int:lesson_id>/add-q/', views.add_question_to_lesson, name='add_question_to_lesson'),
    path('api/questions/<int:question_id>/update/', views.update_question_by_id, name='update_question_by_id'),
    path('api/questions/<int:question_id>/delete/', views.delete_question_by_id, name='delete_question_by_id'),

    # 🔄 dj-rest-auth
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]

# ✅ Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
