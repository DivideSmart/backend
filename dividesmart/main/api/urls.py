from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', include('main.api.users.urls')),

    path('exchanges/', include('main.api.exchanges.urls')),

    path('login/', views.login),

    path('logout/', views.logout)
    # url(r'user$', views.get_current_user),

    # url(r'users/(?P<pk>\d+)', views.UserAPIView.as_view()),

    # url(r'signin$', views.sign_in),

    # url(r'signin/google$', views.google_sign_in),

    # url(r'signin/facebook$', views.facebook_sign_in),

    # url(r'signoff', views.sign_off),
]
