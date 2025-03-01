from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-m&7454wb6*tg3c3-ff7zn1!e=1ky$@nfz4gje^^b25neo-4&x#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# ==============================================================================
# Application definition
# ==============================================================================

INSTALLED_APPS = [
    # Django default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',  # Required by django-allauth

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',

    'dj_rest_auth',
    'dj_rest_auth.registration',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    # Optional: Social providers
    # 'allauth.socialaccount.providers.google',

    'corsheaders',

    # Your custom apps
    'myapp',
]

SITE_ID = 1  # Required by django.contrib.sites

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'allauth.account.middleware.AccountMiddleware',  # ✅ Required for django-allauth
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # ✅ Required for allauth
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ==============================================================================
# Database
# ==============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ==============================================================================
# Password validation
# ==============================================================================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]

# ==============================================================================
# Internationalization
# ==============================================================================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ==============================================================================
# Static files
# ==============================================================================

STATIC_URL = 'static/'

# ==============================================================================
# Default primary key field type
# ==============================================================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==============================================================================
# CORS settings (React frontend)
# ==============================================================================

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

# ==============================================================================
# Django REST Framework
# ==============================================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ==============================================================================
# Simple JWT (Optional if using JWT)
# ==============================================================================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# ==============================================================================
# dj-rest-auth
# ==============================================================================

REST_USE_JWT = True  # ✅ You can toggle this as per your requirement

# ==============================================================================
# django-allauth settings
# ==============================================================================

ACCOUNT_LOGIN_METHODS = {'email'}  # ✅ Only allow login by email

# ✅ Only email + passwords for signup, and email is required (denoted by *)
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']

ACCOUNT_EMAIL_VERIFICATION = 'mandatory'  # ✅ Require email verification
ACCOUNT_CONFIRM_EMAIL_ON_GET = True  # ✅ Auto-verify on link click

ACCOUNT_ADAPTER = 'allauth.account.adapter.DefaultAccountAdapter'

# ==============================================================================
# Email backend (for development)
# ==============================================================================

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ==============================================================================
# Sites framework
# ==============================================================================

SITE_ID = 1