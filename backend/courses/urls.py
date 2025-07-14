
from django.urls import path
from . import views
from .views import CourseListAPIView, CourseDetailAPIView, CourseDetailByIdAPIView

urlpatterns = [
    
    path('', CourseListAPIView.as_view(), name='course-list'),
    path('enroll/', views.enroll_course, name='enroll_course'),
    # path('enrolled-courses/', views.EnrolledCoursesView.as_view(), name='enrolled-courses'),
    path('<slug:slug>/', CourseDetailAPIView.as_view(), name='course-detail'),
    path('id/<int:pk>/', CourseDetailByIdAPIView.as_view(), name='course-detail-by-id'),
]

