from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile
from .models import Question, LessonBlock

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance, defaults={'is_verified': False})

@receiver(post_save, sender=Question)
def auto_add_question_block(sender, instance, created, **kwargs):
    if created:
        # Only create a block if one doesn't already exist for this question
        if not LessonBlock.objects.filter(question=instance).exists():
            existing_blocks = LessonBlock.objects.filter(lesson=instance.lesson)
            next_order = existing_blocks.count() + 1

            LessonBlock.objects.create(
                lesson=instance.lesson,
                type='question',
                order=next_order,
                question=instance
            )