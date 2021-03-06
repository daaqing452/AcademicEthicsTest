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

import datetime
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
	if not suser.study_finish:
		return render(request, 'permission_denied.html', {'alert': True, 'alert_info_c': '请先完成所有学术道德规范自学中的必学任务！', 'alert_info_e': 'Please complete all the required tasks in Academic Ethics Self-learning first.'})

	if op == 'load':
		jdata = {}
		if suser.qstring == '[]':
			question = Question.objects.all()[0]
			arr = json.loads(question.question)
			random.shuffle(arr)
			arr = arr[:question.test_num]
			for i in range(len(arr)):
				ra = arr[i]['right_answer']
				for j in range(len(ra)):
					ra[j] = ra[j] ^ (i+1)
				arr[i]['right_answer'] = ra
			jdata['qstring'] = suser.qstring = qstring = json.dumps(arr)
			suser.save()
		else:
			jdata['qstring'] = suser.qstring
		return HttpResponse(json.dumps(jdata))

	if op == 'submit':
		jdata = {}
		arr = json.loads(request.POST.get('qstring'))
		score = 0
		for i in range(len(arr)):
			ra = arr[i]['right_answer']
			fa = arr[i]['filled_answer']
			for j in range(len(ra)):
				ra[j] = ra[j] ^ (i+1)
			arr[i]['right_answer'] = ra
			flag = True
			if len(ra) != len(fa):
				flag = False
			else:
				for j in range(len(ra)):
					if ra[j] != fa[j]:
						flag = False
			if flag:
				score += 1
		astring = json.dumps(arr)
		answer = Answer.objects.create(username=suser.username, astring=astring, score=100*score//len(arr), create_time=datetime.datetime.now())
		jdata['n_answer'] = len(Answer.objects.all())
		return HttpResponse(json.dumps(jdata))

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

	if op == 'retest':
		if len(answers) > 0:
			answers[0].delete()
		return HttpResponse(json.dumps({})) 

	if op == 'test_promise':
		jdata = {'res': 'no'}
		print(answers[0].score)
		if len(answers) > 0 and answers[0].score > 99.9999:
			jdata['res'] = 'yes'
		jdata['foreigner'] = rdata['foreigner']
		return HttpResponse(json.dumps(jdata))
	
	return render(request, "survey_report.html", rdata)