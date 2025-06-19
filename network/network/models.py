from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    following = models.ManyToManyField('self', symmetrical=False, related_name="followers", blank=True)


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    def __str__(self):
        return f"{self.author}: {self.content[:30]}"
    
    def serialize(self, user=None):
        return {
            "id": self.id,
            "author": self.author.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %H:%M"),
            "likes": self.likes.count(),
            "liked": user.is_authenticated and user in self.likes.all() if user else False,
            "editable": user.is_authenticated and user == self.author if user else False
    }
        
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_set")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers_set")

    def __str__(self):
        return f"{self.follower} follows {self.following}"