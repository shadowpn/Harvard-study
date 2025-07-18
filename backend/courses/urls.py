from django.urls import path
from .views import (
    CourseListAPIView,
    CourseDetailAPIView,         
    CourseDetailByIdAPIView,     
    enroll_course,
    CommentListCreateAPIView,
)
urlpatterns = [
    
    path(
        '', 
        CourseListAPIView.as_view(), 
        name='course-list'),
    
    path(
        'enroll/', 
        enroll_course, 
        name='enroll-course'),
    
    path(
        '<slug:slug>/comments/', 
        CommentListCreateAPIView.as_view(), 
        name='course-comments'),
    
    path(
        '<slug:slug>/', 
        CourseDetailAPIView.as_view(), 
        name='course-detail'),
    
    path(
        'id/<int:pk>/', 
        CourseDetailByIdAPIView.as_view(), 
        name='course-detail-by-id'),
]
