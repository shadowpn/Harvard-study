from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    start_date = models.DateField(blank=True, null=True)
    is_unlimited = models.BooleanField(default=False, help_text="Отметь, если курс доступен бессрочно")
    video = models.FileField(upload_to='courses/videos/', blank=True, null=True)
    image = models.ImageField(upload_to="courses/")
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


