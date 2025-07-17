from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, RegisterSerializer, CourseSerializer
from rest_framework.generics import ListAPIView
from courses.models import Course  # импортируем модель курса

User = get_user_model()
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# --- JWT АВТОРИЗАЦИЯ ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
    def validate(self, attrs):
        email = attrs.get('email')
        if not email:
            raise serializers.ValidationError({'email': 'This field is required.'})
        attrs['username'] = email
        return super().validate(attrs)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer   

class EnrolledCoursesAPIView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return self.request.user.enrolled_courses.all().order_by('-created_at')
    
# --- ПРОФИЛЬ ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unenroll_course(request):
    course_id = request.data.get('courseId')
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Курс не найден'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    user.enrolled_courses.remove(course)

    return Response({'message': 'Курс успешно удалён из профиля'}, status=status.HTTP_200_OK)

