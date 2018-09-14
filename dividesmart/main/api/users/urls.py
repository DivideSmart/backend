from django.urls import path
from . import views

urlpatterns = [
    path('<int:user_id>/', views.user),
    path('<int:user_id>/friends/', views.friends),
    path('<int:user_id>/friends/<int:friend_id>/', views.friend),
    path('<int:user_id>/friends/<int:friend_id>/entries', views.friend_entries),
    path('<int:user_id>/friends/<int:friend_id>/bills', views.friend_bills),
    path('<int:user_id>/friends/<int:friend_id>/payments', views.friend_payments),
    path('<int:user_id>/groups/', views.groups)
]
