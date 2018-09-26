from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', include('main.api.users.urls')),

    path('user/', include('main.api.user.urls')),

    path('groups/', include('main.api.groups.urls')),
    
    path('bills/', include('main.api.bills.urls')),

    path('login/fb/', views.handle_fb_login),

    path('login/google/', views.handle_google_login),

    path('login/', views.handle_login),

    path('register/', views.handle_register),

    path('logout/', views.handle_logout),

    # url(r'user$', views.get_current_user),

    # url(r'users/(?P<pk>\d+)', views.UserAPIView.as_view()),

    # url(r'signin$', views.sign_in),

    # url(r'signin/google$', views.google_sign_in),

    # url(r'signin/facebook$', views.facebook_sign_in),

    # url(r'signoff', views.sign_off),
]
