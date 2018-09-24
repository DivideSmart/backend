from django.urls import path
from . import views

urlpatterns = [
    path('', views.user),
    path('friends/', views.friends),
    path('friends/<uuid:friend_id>/', views.friend),
    path('friends/<uuid:friend_id>/entries/', views.friend_entries),
    path('friends/<uuid:friend_id>/payments/', views.friend_payments),
    path('friends/<uuid:friend_id>/payments/<uuid:payment_id>/', views.friend_payment),
    path('groups/', views.groups)
]
