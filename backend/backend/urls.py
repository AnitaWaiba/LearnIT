from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

from myapp.views import (
    SignupView,
    CustomLoginView,
    ProfileView,
    admin_dashboard,
    list_users,
    create_user,
    update_user,
    delete_user
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    # 🔧 Admin Panel
    path('admin/', admin.site.urls),

    # ✅ Root Test Endpoint
    path('', lambda request: HttpResponse("✅ Django API is running")),

    # 🔐 Authentication (Custom)
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', CustomLoginView.as_view(), name='login'),

    # 👤 User Profile (Authenticated GET/PUT)
    path('api/profile/', ProfileView.as_view(), name='user_profile'),

    # 🔑 JWT Token Endpoints (Optional if using SimpleJWT directly)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 🛠️ Admin Dashboard & User Management
    path('api/admin/dashboard/', admin_dashboard, name='admin_dashboard'),
    path('api/admin/users/', list_users, name='list_users'),
    path('api/admin/users/create/', create_user, name='create_user'),
    path('api/admin/users/<int:user_id>/update/', update_user, name='update_user'),
    path('api/admin/users/<int:user_id>/delete/', delete_user, name='delete_user'),

    # ✅ Optional: dj-rest-auth login/logout/password reset/registration
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]

# ✅ Serve media files during development (for avatar uploads, lesson icons, etc.)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
