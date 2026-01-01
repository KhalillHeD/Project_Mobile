from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile

User = get_user_model()


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
    id = serializers.IntegerField(read_only=True)

    # Frontend uses "name" but it maps to User.username
    name = serializers.CharField(source="username", required=False)
    email = serializers.EmailField(required=False)

    # Profile fields
    role = serializers.CharField(source="userprofile.role", read_only=True)

    avatar = serializers.ImageField(source="userprofile.avatar", required=False, allow_null=True)
    skills = serializers.CharField(source="userprofile.skills", required=False, allow_blank=True)
    experience_years = serializers.IntegerField(source="userprofile.experience_years", required=False, allow_null=True)
    bio = serializers.CharField(source="userprofile.bio", required=False, allow_blank=True)
    company_name = serializers.CharField(source="userprofile.company_name", required=False, allow_blank=True)
    position_title = serializers.CharField(source="userprofile.position_title", required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "role",
            "avatar",
            "skills",
            "experience_years",
            "bio",
            "company_name",
            "position_title",
        )

    def update(self, instance, validated_data):
        # user fields
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.save()

        # profile fields (nested via source="userprofile.xxx")
        profile_data = validated_data.pop("userprofile", {})
        profile, _ = UserProfile.objects.get_or_create(user=instance)

        allowed = {
            "avatar",
            "skills",
            "experience_years",
            "bio",
            "company_name",
            "position_title",
        }
        for k, v in profile_data.items():
            if k in allowed:
                setattr(profile, k, v)

        profile.save()
        return instance