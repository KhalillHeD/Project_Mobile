from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        write_only=True,           
    )
    password = serializers.CharField(write_only=True)

    skills = serializers.CharField(required=False, allow_blank=True, write_only=True)
    experience_years = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True, write_only=True)
    company_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    position_title = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "role",
            "skills",
            "experience_years",
            "bio",
            "company_name",
            "position_title",
        )

    def create(self, validated_data):
        role = validated_data.pop("role")
        skills = validated_data.pop("skills", "")
        experience_years = validated_data.pop("experience_years", None)
        bio = validated_data.pop("bio", "")
        company_name = validated_data.pop("company_name", "")
        position_title = validated_data.pop("position_title", "")
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        UserProfile.objects.create(
            user=user,
            role=role,
            skills=skills,
            experience_years=experience_years,
            bio=bio,
            company_name=company_name,
            position_title=position_title,
        )
        return user
    
class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "role", "skills",
                  "experience_years", "bio", "company_name", "position_title")
