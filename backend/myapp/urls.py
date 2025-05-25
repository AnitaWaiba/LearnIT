from django.urls import path
from .views import (
    get_daily_quests,
    ListQuestView,
    UpdateQuestView,
    DeleteQuestView,
    submit_answer,
    get_leaderboard,
    get_notifications,
    mark_notification_read,
    reset_password,
    forgot_password,
)

urlpatterns = [
    path('daily-quests/', get_daily_quests),
    path('admin/quests/', ListQuestView.as_view()),
    path('admin/quests/<int:pk>/update/', UpdateQuestView.as_view()),
    path('admin/quests/<int:pk>/delete/', DeleteQuestView.as_view()),
    path('submit-answer/<int:question_id>/', submit_answer, name='submit-answer'),
    path('leaderboard/', get_leaderboard, name='get_leaderboard'),

    path('notifications/', get_notifications, name='notifications'),
    path('notifications/<int:notification_id>/read/', mark_notification_read, name='mark_notification_read'),

    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/<uidb64>/<token>/', reset_password, name='reset-password'),

]
