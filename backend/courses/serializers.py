from rest_framework import serializers
from .models import Course, Comment

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

class CommentSerializer(serializers.ModelSerializer):
    
    author = serializers.StringRelatedField(source='user.username', read_only=True)
    
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'author',
            'text',
            'created_at',
            'parent',      
            'replies',     
        ]
        read_only_fields = ['id', 'author', 'created_at', 'replies']
    
    def get_replies(self, obj):
        
        qs = obj.replies.order_by('-created_at')  
        return CommentSerializer(qs, many=True, context=self.context).data

    def create(self, validated_data):
        
        course = validated_data.pop('course')
        user   = validated_data.pop('user')
        return Comment.objects.create(course=course, user=user, **validated_data)