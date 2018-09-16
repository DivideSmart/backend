from django.urls import path
from . import views

urlpatterns = [
    path('', views.groups),
    path('<int:group_id>', views.group),
    path('<int:group_id>/members/', views.group_members),
    path('<int:group_id>/invites/', views.group_invites),
    path('<int:group_id>/invites/<int:invite_id>/', views.group_invite),
    path('<int:group_id>/invites/accept/', views.group_accept),
    path('<int:group_id>/invites/decline/', views.group_decline),
    path('<int:group_id>/entries/', views.group_entries),
    path('<int:group_id>/bills/', views.group_bills),
    path('<int:group_id>/payments/', views.group_payments)
]
