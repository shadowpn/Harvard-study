from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'start_date', 'is_unlimited', 'created_at')
    prepopulated_fields = {'slug': ('title',)}


