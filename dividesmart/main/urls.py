from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^api/', include('main.api.urls')),


    url(r'^form/$', views.display_form),

    url(r'^qr/$', views.display_qr_scanner),

    url(r'u/n/(?P<pk>\d+)', views.display_new_user),

    url(r'^$', views.display_index),
    url(r'^u', views.display_index),
]
