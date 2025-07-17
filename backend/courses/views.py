from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .models import Course, Comment
from .serializers import CourseSerializer, CommentSerializer

class CourseListAPIView(ListAPIView):
    queryset = Course.objects.all().order_by('-created_at')
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

class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    # permission_classes = [permissions.IsAuthenticated]
    def get_permissions(self):
        # GET — свободно, POST — только для авторизованных
        if self.request.method in permissions.SAFE_METHODS:
            return [ permissions.AllowAny() ]
        return [ permissions.IsAuthenticated() ]

    def get_queryset(self):
        # возвращаем только комментарии к конкретному курсу
        course_slug = self.kwargs['slug']
        return Comment.objects.filter(course__slug=course_slug, parent=None).order_by('-created_at')

    def perform_create(self, serializer):
        # передаём course и user в сериализатор
        course = Course.objects.get(slug=self.kwargs['slug'])
        serializer.save(course=course, user=self.request.user)