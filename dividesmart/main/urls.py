from django.conf.urls import include, url
from django.urls import path
from . import views

urlpatterns = [
    url(r'^api/', include('main.api.urls')),

    path('register/', views.register),

    url('login/', views.display_login),

    url(r'^$', views.display_index),

    url(r'^form/$', views.display_form),

    url(r'^qr/$', views.display_qr_scanner),

    url(r'u/(?P<pk>\d+)', views.display_user),

    url(r'u/n/(?P<pk>\d+)', views.display_new_user),
]
