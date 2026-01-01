# jsr/models.py
from django.db import models
from api.models import UserProfile
from django.conf import settings

class Job(models.Model):
    recruiter = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="jobs"
    )
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    salary_range = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    tags = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class JobLike(models.Model):
    LIKE_CHOICES = (("like", "Like"), ("dislike", "Dislike"))

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="likes")
    jobseeker = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="job_likes"
    )
    action = models.CharField(max_length=10, choices=LIKE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("job", "jobseeker")


class Match(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="matches")
    jobseeker = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="matches"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("job", "jobseeker")

class Profile(models.Model):
    ROLE_JOBSEEKER = "jobseeker"
    ROLE_RECRUITER = "recruiter"
    ROLE_CHOICES = [
        (ROLE_JOBSEEKER, "Jobseeker"),
        (ROLE_RECRUITER, "Recruiter"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Common fields
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    # Jobseeker fields
    skills = models.TextField(blank=True)  # comma-separated or free text
    bio = models.TextField(blank=True)
    years_of_experience = models.PositiveIntegerField(blank=True, null=True)

    # Recruiter fields
    company = models.CharField(max_length=255, blank=True)
    recruiter_role = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user_id} ({self.role})"