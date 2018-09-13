from django.urls import path
from . import views

urlpatterns = [
    path('<int:id>', views.user),
    path('<int:user_id>/friends/', views.friends),
    path('<int:user_id>/friends/<int:friend_id>/', views.friend)
]
