from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Import your custom view functions or class-based views from your app
from myapp.views import (
    SignupView,
    CustomLoginView,
    admin_dashboard,
    list_users,
    create_user,
    update_user,
    delete_user
)

# Import JWT token views from DRF SimpleJWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    # Django admin panel
    path('admin/', admin.site.urls),

    # Root welcome endpoint (optional, for test purposes)
    path('', lambda request: HttpResponse("✅ Welcome to the Django API!")),

    # =====================================================
    # 🔐 AUTHENTICATION ENDPOINTS
    # =====================================================

    # Custom authentication
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', CustomLoginView.as_view(), name='login'),

    # dj-rest-auth endpoints (login/logout/password reset/etc.)
    path('dj-rest-auth/', include('dj_rest_auth.urls')),

    # dj-rest-auth registration endpoints (email verification flows if enabled)
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    # JWT token authentication endpoints (optional if using dj-rest-auth JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # =====================================================
    # 🛠️ ADMIN DASHBOARD & USER MANAGEMENT ENDPOINTS
    # =====================================================

    # Admin dashboard (stats/analytics)
    path('api/admin/dashboard/', admin_dashboard, name='admin_dashboard'),

    # CRUD operations for user management in the admin panel
    path('api/admin/users/', list_users, name='list_users'),                        # GET list of users
    path('api/admin/users/create/', create_user, name='create_user'),               # POST create new user
    path('api/admin/users/<int:user_id>/update/', update_user, name='update_user'), # PUT/PATCH update user
    path('api/admin/users/<int:user_id>/delete/', delete_user, name='delete_user'), # DELETE user
]
