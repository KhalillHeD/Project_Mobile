from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    ROLE_CHOICES = (
        ("jobseeker", "Jobseeker"),
        ("recruiter", "Recruiter"),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    skills = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    bio = models.TextField(blank=True)

    company_name = models.CharField(max_length=255, blank=True)
    position_title = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"