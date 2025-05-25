from django.core.management.base import BaseCommand
from myapp.models import UserProfile

class Command(BaseCommand):
    help = 'Mark all existing user profiles as verified'

    def handle(self, *args, **kwargs):
        profiles_to_update = UserProfile.objects.filter(is_verified=False)
        count = profiles_to_update.update(is_verified=True)
        self.stdout.write(f"✅ Marked {count} user profiles as verified.")
