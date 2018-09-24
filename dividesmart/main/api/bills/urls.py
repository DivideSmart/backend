from django.urls import path
from main.api.bills import views

urlpatterns = [
    path('', views.bills),
    path('<uuid:bill_id>/', views.bill),
]
