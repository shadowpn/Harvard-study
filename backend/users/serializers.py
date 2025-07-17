from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from courses.serializers import CourseSerializer  
User = get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone': {'required': False}
        }
    def create(self, validated_data):       
        return User.objects.create_user(**validated_data)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data.update({
            "id": self.user.id,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "phone": self.user.phone,
        })
        return data      
class UserSerializer(serializers.ModelSerializer):
    enrolled_courses = CourseSerializer(many=True, read_only=True)
    
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'created_at', 'enrolled_courses']