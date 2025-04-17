from django.urls import path
from .views import (
    get_daily_quests,
    ListQuestView,
    UpdateQuestView,
    DeleteQuestView,
    submit_answer,
    get_leaderboard,
)

urlpatterns = [
    path('daily-quests/', get_daily_quests),
    path('admin/quests/', ListQuestView.as_view()),
    path('admin/quests/<int:pk>/update/', UpdateQuestView.as_view()),
    path('admin/quests/<int:pk>/delete/', DeleteQuestView.as_view()),
    path('submit-answer/<int:question_id>/', submit_answer, name='submit-answer'),
    path('leaderboard/', get_leaderboard, name='get_leaderboard'),
]
