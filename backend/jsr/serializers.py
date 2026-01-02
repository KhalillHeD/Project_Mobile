from rest_framework import serializers
from .models import Job, Match, JobLike
from api.models import UserProfile




class JobSerializer(serializers.ModelSerializer):
    recruiter_id = serializers.IntegerField(source="recruiter.id", read_only=True)
    recruiter_name = serializers.CharField(
        source="recruiter.company_name", read_only=True
    )

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
            "image_url",          # NEW
            "created_at",
            "recruiter_id",
            "recruiter_name",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        profile = UserProfile.objects.get(user=request.user)
        return Job.objects.create(recruiter=profile, **validated_data)


# class JobSerializer(serializers.ModelSerializer):
#     recruiter_name = serializers.CharField(
#         source="recruiter.user.username", read_only=True
#     )

#     class Meta:
#         model = Job
#         fields = [
#             "id",
#             "title",
#             "company_name",
#             "location",
#             "salary_range",
#             "description",
#             "tags",
#             "created_at",
#             "recruiter_name",
#         ]


class JobLikeSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=JobLike.LIKE_CHOICES)


class MatchSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)

    class Meta:
        model = Match
        fields = ["id", "job", "job_title", "company_name", "created_at"]
