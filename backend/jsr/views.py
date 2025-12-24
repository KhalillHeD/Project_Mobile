from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from api.models import UserProfile
from .models import Job, JobLike, Match
from .serializers import JobSerializer, JobLikeSerializer, MatchSerializer

def get_user_profile(user) -> UserProfile:
    return UserProfile.objects.get(user=user)

class JobListCreateView(generics.ListCreateAPIView):
    """
    GET: list jobs (for jobseekers).
    POST: create job (for recruiters).
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = get_user_profile(self.request.user)

        # If jobseeker: show jobs they haven't disliked yet (simple version)
        if profile.role == "jobseeker":
            disliked_ids = JobLike.objects.filter(
                jobseeker=profile, action="dislike"
            ).values_list("job_id", flat=True)
            return Job.objects.exclude(id__in=disliked_ids).order_by("-created_at")

        # If recruiter: show only their own jobs
        if profile.role == "recruiter":
            return Job.objects.filter(recruiter=profile).order_by("-created_at")

        return Job.objects.none()

    def perform_create(self, serializer):
        profile = get_user_profile(self.request.user)
        if profile.role != "recruiter":
            raise permissions.PermissionDenied("Only recruiters can create jobs.")
        serializer.save(recruiter=profile)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Job.objects.all()

    def perform_update(self, serializer):
        profile = get_user_profile(self.request.user)
        job = self.get_object()
        if job.recruiter != profile:
            raise permissions.PermissionDenied("You can only edit your own jobs.")
        serializer.save()

    def perform_destroy(self, instance):
        profile = get_user_profile(self.request.user)
        if instance.recruiter != profile:
            raise permissions.PermissionDenied("You can only delete your own jobs.")
        instance.delete()

from rest_framework.views import APIView

class JobLikeView(APIView):
    """
    POST /api/jobs/<id>/like/
    Body: { "action": "like" | "dislike" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        profile = get_user_profile(request.user)
        if profile.role != "jobseeker":
            raise permissions.PermissionDenied("Only jobseekers can like jobs.")

        job = get_object_or_404(Job, pk=pk)
        serializer = JobLikeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data["action"]

        like_obj, created = JobLike.objects.update_or_create(
            job=job,
            jobseeker=profile,
            defaults={"action": action},
        )

        # For V1: create a Match whenever user likes a job
        match = None
        if action == "like":
            match, _ = Match.objects.get_or_create(job=job, jobseeker=profile)

        return Response(
          {
            "status": "ok",
            "action": action,
            "matched": bool(match),
          },
          status=status.HTTP_200_OK,
        )
class MatchListView(generics.ListAPIView):
    """
    GET /api/matches/
    - For jobseeker: all jobs they matched with.
    - For recruiter: all matches across their jobs.
    """
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = get_user_profile(self.request.user)

        if profile.role == "jobseeker":
            return Match.objects.filter(jobseeker=profile, is_active=True).order_by(
                "-created_at"
            )

        if profile.role == "recruiter":
            return Match.objects.filter(job__recruiter=profile, is_active=True).order_by(
                "-created_at"
            )

        return Match.objects.none()

