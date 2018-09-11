from django.urls import path
from . import views

urlpatterns = [
    path('', views.groups),
    path('<int:id>', views.group)
]
