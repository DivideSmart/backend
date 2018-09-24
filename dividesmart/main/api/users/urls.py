from django.urls import path
from . import views

urlpatterns = [
    path('<uuid:user_id>/', views.user),
]
