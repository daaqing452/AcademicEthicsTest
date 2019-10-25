"""AcademicEthicsTest URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views import static

from SUser.views import *
from Survey.views import *
import AcademicEthicsTest.settings as settings

urlpatterns = [
    path('admin/', admin.site.urls),

    url(r'^$', index),
    url(r'^index/$', index),
    url(r'^login/$', login),
    url(r'^show_files/$', show_files),
    url(r'^show_files/([0-9]{1,1})/$', show_files),
    url(r'^backend/$', backend),
    url(r'^au/([a-z0-9]{1,20})/$', add_user),
    url(r'^du/([a-z0-9]{1,20})/$', delete_user),
    
    url(r'^survey_create/$', survey_create),
    url(r'^survey_fill/$', survey_fill),
    url(r'^survey_report/$', survey_report),
    url(r'^survey_report/([a-z0-9]{1,20})/$', survey_report),

    url(r'^media/(?P<path>.*)$', static.serve, {'document_root': settings.MEDIA_ROOT}, name='media'),

] # + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG == False:
    urlpatterns += [ url(r'^static/(?P<path>.*)$', static.serve, {'document_root': settings.STATIC_ROOT}, name='static'), ]
