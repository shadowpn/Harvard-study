from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'start_date', 'is_unlimited', 'created_at', 'image_preview')
    search_fields = ('title', 'description')  # поиск по названию и описанию
    list_filter = ('start_date', 'is_unlimited', 'created_at')  # фильтрация
    prepopulated_fields = {'slug': ('title',)}  # автозаполнение слага
    readonly_fields = ('image_preview',)  # делает preview только для чтения

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" />')
        return "No image"

    image_preview.short_description = 'Preview'
