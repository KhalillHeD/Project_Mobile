from rest_framework import serializers
from .models import Job, Match, JobLike


class JobSerializer(serializers.ModelSerializer):
    recruiter_name = serializers.CharField(
        source="recruiter.user.username", read_only=True
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company_name",
            "location",
            "salary_range",
            "description",
            "tags",
            "created_at",
            "recruiter_name",
        ]


class JobLikeSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=JobLike.LIKE_CHOICES)


class MatchSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)

    class Meta:
        model = Match
        fields = ["id", "job", "job_title", "company_name", "created_at"]
