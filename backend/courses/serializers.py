from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    video_file = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
        
    def get_video_file(self, obj):
        request = self.context.get('request')
        if obj.video and request:
            return request.build_absolute_uri(obj.video.url)
        return None
