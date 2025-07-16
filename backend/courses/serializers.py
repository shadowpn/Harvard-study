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
    # Показываем имя пользователя, который оставил комментарий
    author = serializers.StringRelatedField(source='user.username', read_only=True)
    # Дочерние ответы
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'author',
            'text',
            'created_at',
            'parent',      # id родительского комментария (если есть)
            'replies',     # вложенные ответы
        ]
        read_only_fields = ['id', 'author', 'created_at', 'replies']
    
    def get_replies(self, obj):
        # берем все непосредственные ответы и сериализуем их
        qs = obj.replies.order_by('-created_at')  # самые свежие первыми
        return CommentSerializer(qs, many=True, context=self.context).data

    def create(self, validated_data):
        # Автоматически подставляем user из request
        course = validated_data.pop('course')
        user   = validated_data.pop('user')
        return Comment.objects.create(course=course, user=user, **validated_data)