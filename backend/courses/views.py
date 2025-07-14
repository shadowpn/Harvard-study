from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Course
from .serializers import CourseSerializer

class CourseListAPIView(ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseDetailAPIView(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = "slug"

class CourseDetailByIdAPIView(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = "pk"  
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request):
    course_id = request.data.get('courseId')
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    # Добавляем курс в список зачисленных у пользователя
    user = request.user
    user.enrolled_courses.add(course)  # 🔥 ЭТО ОЧЕНЬ ВАЖНО

    # Увеличиваем счётчик количества зачисленных
    course.enrolled += 1
    course.save()

    return Response({'message': 'Successfully enrolled!'}, status=status.HTTP_200_OK)
