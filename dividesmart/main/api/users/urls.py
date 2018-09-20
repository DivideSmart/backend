from django.urls import path
from . import views

urlpatterns = [
    path('<uuid:user_id>/', views.user),
    path('<uuid:user_id>/friends/', views.friends),
    path('<uuid:user_id>/friends/<uuid:friend_id>/', views.friend),
    path('<uuid:user_id>/friends/<uuid:friend_id>/entries/', views.friend_entries),
    path('<uuid:user_id>/friends/<uuid:friend_id>/bills/', views.friend_bills),
    path('<uuid:user_id>/friends/<uuid:friend_id>/bills/<uuid:bill_id>', views.friend_bill),
    path('<uuid:user_id>/friends/<uuid:friend_id>/payments/', views.friend_payments),
    path('<uuid:user_id>/groups/', views.groups)
]
