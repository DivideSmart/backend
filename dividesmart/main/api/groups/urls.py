from django.urls import path
from main.api.groups import views

urlpatterns = [
    path('', views.groups),
    path('<uuid:group_id>/', views.group),
    path('<uuid:group_id>/members/', views.group_members),
    path('<uuid:group_id>/entries/', views.group_entries),
    path('<uuid:group_id>/entries/<uuid:bill_id>', views.view_bill)
]
