from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    video_file = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
        
    def get_video_file(self, obj):
        if obj.video:
            return obj.video.url
        return None
