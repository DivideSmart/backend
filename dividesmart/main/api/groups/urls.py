from django.urls import path
from main.api.groups import views

urlpatterns = [
    path('', views.groups),
    path('<uuid:group_id>/', views.group),
    path('<uuid:group_id>/members/', views.group_members),
    path('<uuid:group_id>/invites/', views.group_invites),
    path('<uuid:group_id>/invites/<uuid:invite_id>/', views.group_invite),
    path('<uuid:group_id>/invites/accept/', views.group_accept),
    path('<uuid:group_id>/invites/decline/', views.group_decline),
    path('<uuid:group_id>/entries/', views.group_entries),
    path('<uuid:group_id>/bills/', views.group_bills),
    path('<uuid:group_id>/bills/<uuid:bill_id>/', views.group_bill),
    path('<uuid:group_id>/payments/', views.group_payments),
    path('<uuid:group_id>/payments/<uuid:payment_id>/', views.group_payment)
]
