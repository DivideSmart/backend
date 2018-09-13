from django.urls import path
from . import views

urlpatterns = [
    path('<int:id>', views.user),
    path('<int:id>/friends/', views.friends),
]
