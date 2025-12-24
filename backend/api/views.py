from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer
from .models import UserProfile


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "role": profile.role,
            "skills": profile.skills,
            "experience_years": profile.experience_years,
            "bio": profile.bio,
            "company_name": profile.company_name,
            "position_title": profile.position_title,
        })
