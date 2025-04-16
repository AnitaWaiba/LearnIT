from django.core.management.base import BaseCommand
from myapp.models import Question, LessonBlock

class Command(BaseCommand):
    help = 'Ensure every Question has a corresponding LessonBlock entry'

    def handle(self, *args, **kwargs):
        created = 0
        for question in Question.objects.all():
            if not LessonBlock.objects.filter(question=question).exists():
                order = LessonBlock.objects.filter(lesson=question.lesson).count() + 1
                LessonBlock.objects.create(
                    lesson=question.lesson,
                    type='question',
                    order=order,
                    question=question
                )
                created += 1
        self.stdout.write(self.style.SUCCESS(f'✅ Synced {created} missing LessonBlock(s).'))
