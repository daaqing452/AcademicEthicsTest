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

import json

def survey_create(request):
	rdata, op, suser = Utils.get_request_basis(request)

	if op == 'release':
		qstring = request.POST.get('qstring')
		qarray = json.loads(qstring)
		for qdic in qarray:
			question = Question.objects.create(founder='', question=json.dumps(qdic))
		return HttpResponse(json.dumps(rdata))

	return render(request, "survey_create.html")

def survey_fill(request):
	rdata, op, suser = Utils.get_request_basis(request)

	if op == 'load':
		jdata = {}
		questions = Question.objects.all()
		qstring = [question.question for question in questions]
		jdata['status'] = 1
		jdata['title'] = 'xxx'
		jdata['qstring'] = json.dumps(qstring)
		return HttpResponse(json.dumps(jdata))

	return render(request, "survey_fill.html")