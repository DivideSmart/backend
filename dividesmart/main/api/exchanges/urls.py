from django.urls import path
from . import views

urlpatterns = [
    path('', views.exchanges),
    path('<int:id>', views.exchange)
]
