from django.urls import path
from . import views

urlpatterns = [
    path('', views.groups),
    path('<int:id>', views.group),
    path('<int:group_id>/members/', views.group_members),
    path('<int:group_id>/invites/', views.group_invites)
]
