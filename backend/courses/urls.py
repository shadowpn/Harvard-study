# backend/courses/urls.py
from django.urls import path
from .views import (
    CourseListAPIView,
    CourseDetailAPIView,         
    CourseDetailByIdAPIView,     
    enroll_course,
    CommentListCreateAPIView,
)

urlpatterns = [
    # 1) Список курсов
    path(
        '', 
        CourseListAPIView.as_view(), 
        name='course-list'
    ),

    # 2) POST /api/courses/enroll/  — зачисление на курс
    path(
        'enroll/', 
        enroll_course, 
        name='enroll-course'
    ),

    # 3) Комментарии к курсу по slug
    #    Должен идти ДО маршрута «<slug>/» иначе будет перехвачен им
    path(
        '<slug:slug>/comments/', 
        CommentListCreateAPIView.as_view(), 
        name='course-comments'
    ),

    # 4) Детали курса по slug
    path(
        '<slug:slug>/', 
        CourseDetailAPIView.as_view(), 
        name='course-detail'
    ),

    # 5) (опционально) Детали курса по ID
    path(
        'id/<int:pk>/', 
        CourseDetailByIdAPIView.as_view(), 
        name='course-detail-by-id'
    ),
]
