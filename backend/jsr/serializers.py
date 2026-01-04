from rest_framework import serializers
from api.models import UserProfile
from .models import Job, Match, JobLike


class JobSerializer(serializers.ModelSerializer):
    recruiter_id = serializers.IntegerField(source="recruiter.id", read_only=True)
    recruiter_name = serializers.CharField(source="recruiter.company_name", read_only=True)

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company_name",
            "category",
            "governorate",
            "location",
            "salary_range",
            "min_experience_years",
            "max_experience_years",
            "skills",
            "short_description",
            "description",
            "tags",
            "image_url",
            "created_at",
            "recruiter_id",
            "recruiter_name",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        profile = UserProfile.objects.get(user=request.user)
        return Job.objects.create(recruiter=profile, **validated_data)


class JobLikeSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=JobLike.LIKE_CHOICES)


class MatchSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)
    jobseeker_name = serializers.CharField(source="jobseeker.user.username", read_only=True)

    class Meta:
        model = Match
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "jobseeker_name",
            "created_at",
            "status",
        ]
        # Only allow status update via PATCH
        read_only_fields = ["id", "job", "job_title", "company_name", "jobseeker_name", "created_at"]

    def validate_status(self, value: str):
        if value not in {"pending", "accepted", "rejected"}:
            raise serializers.ValidationError("Invalid status.")
        return value
