from django.conf.urls import include, url
from django.urls import path
from . import views

urlpatterns = [
    url(r'^api/', include('main.api.urls')),

    path('register/', views.register),

    path('login/', views.display_login),

    url(r'^form/$', views.display_form),

    url(r'^qr/$', views.display_qr_scanner),

    url(r'u/n/(?P<pk>\d+)', views.display_new_user),

    url(r'^$', views.display_index),
    url(r'^u', views.display_index),
    url(r'^g', views.display_index),
    url(r'^create', views.display_index),
    url('loginPage/', views.display_index)
]
