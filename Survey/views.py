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
import random

@csrf_exempt
def survey_create(request):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None or suser.admin == False:
		return render(request, 'permission_denied.html')

	if op == 'load':
		jdata = {'qstring': Question.objects.all()[0].question}
		return HttpResponse(json.dumps(jdata)) 

	if op == 'release':
		qstring = request.POST.get('qstring')
		Question.objects.update(question=qstring)
		return HttpResponse('{}')

	return render(request, "survey_create.html", rdata)

@csrf_exempt
def survey_fill(request):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None:
		return render(request, 'permission_denied.html')

	if op == 'load':
		jdata = {}
		question = Question.objects.all()[0]
		arr = json.loads(question.question)
		random.shuffle(arr)
		arr = arr[:question.test_num]
		jdata['qstring'] = qstring = json.dumps(arr)
		return HttpResponse(json.dumps(jdata))

	if op == 'submit':
		astring = request.POST.get('qstring')
		arr = json.loads(astring)
		score = 0
		for question in arr:
			print(question['right_answer'], question['filled_answer'])
			if question['right_answer'] == question['filled_answer']:
				score += 1
		answer = Answer.objects.create(username=suser.username, astring=astring, score=100*score//len(astring))
		return HttpResponse('{}')

	answers = Answer.objects.filter(username=suser.username)
	if len(answers) > 0:
		return HttpResponseRedirect('/survey_report/')
	else:
		return render(request, "survey_fill.html", rdata)

@csrf_exempt
def survey_report(request, username=''):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None:
		return render(request, 'permission_denied.html')
	if username == '':
		username = suser.username
	if suser.admin == False and username != suser.username:
		return render(request, 'permission_denied.html')

	answers = Answer.objects.filter(username=username)
	if len(answers) > 0:
		rdata['username'] = username
	else:
		rdata['not_exist'] = True
	
	if op == 'load':
		jdata = {}
		if len(answers) > 0:
			jdata['qstring'] = answers[0].astring
			jdata['score'] = answers[0].score
		return HttpResponse(json.dumps(jdata))
	
	return render(request, "survey_report.html", rdata)