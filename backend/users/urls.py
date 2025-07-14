from django.urls import path
from .views import (
    RegisterView, user_profile, MyTokenObtainPairView,
    EnrolledCoursesAPIView, unenroll_course
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("user/", user_profile, name="user_profile"),
    path('enrolled-courses/', EnrolledCoursesAPIView.as_view(), name='enrolled-courses'),
    path('unenroll/', unenroll_course, name='unenroll-course'),
]
