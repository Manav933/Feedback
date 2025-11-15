from django.contrib import admin
from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'rating', 'createdAt']
    list_filter = ['rating', 'createdAt']
    search_fields = ['name', 'email', 'message']

