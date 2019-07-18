from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt

from SUser.models import *
from Survey.models import *
import SUser.utils as Utils

def survey(request):
	rdata, op, suser = Utils.get_request_basis(request)

	if op == 'save':
		pass

	return render(request, "survey_create.html")
