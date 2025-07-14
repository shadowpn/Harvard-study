from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField()

    image = models.ImageField(upload_to='courses/')
    video = models.FileField(upload_to='courses/videos/', blank=True, null=True)

    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    duration = models.PositiveIntegerField(default=0, help_text="Время прохождения в часах")
    start_date = models.DateField(blank=True, null=True)

    is_unlimited = models.BooleanField(
        default=False,
        help_text="Отметь, если курс доступен бессрочно"
    )
    level = models.CharField(max_length=50, default="Beginner")
    certificate = models.BooleanField(default=True)
    enrolled = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title



