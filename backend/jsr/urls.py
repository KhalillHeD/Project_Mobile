from django.urls import path
from . import views

urlpatterns = [
    # Jobs
    path("jobs/", views.JobListCreateView.as_view(), name="job-list-create"),
    path("jobs/<int:pk>/", views.JobDetailView.as_view(), name="job-detail"),

    path("jobs/<int:pk>/like/", views.JobLikeView.as_view(), name="job-like"),
    path("matches/", views.MatchListView.as_view(), name="match-list"),
    path("matches/<int:pk>/", views.MatchUpdateStatusView.as_view(), name="match-update-status"),

    path("my-jobs/", views.RecruiterJobListCreateView.as_view(),name="recruiter-job-list-create"),
    
]
