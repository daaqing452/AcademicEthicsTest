# -*- coding: utf-8 -*-
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
import os
import time
from urllib.request import urlopen


APPID = 'YJSDDGF'
APPMD5 = 'b11bc93ee926eff46a7ffc4276bef7df'

def index(request):
	rdata, op, suser = Utils.get_request_basis(request)
	
	if op == 'logout':
		auth.logout(request)
		return HttpResponse('{}');

	rdata['login'] = suser is not None
	rdata['id_tsinghua_url'] = 'https://id.tsinghua.edu.cn/do/off/ui/auth/login/form/' + APPMD5 + '/1?/login'
	return render(request, 'index.html', rdata)

def login(request):
    ticket = request.GET['ticket']
    userip = request.META['REMOTE_ADDR']
    userip = userip.replace('.', '_')
    info_url = 'https://id.tsinghua.edu.cn/thuser/authapi/checkticket/' + APPID + '/' + ticket + '/' + userip
    resp = urlopen(info_url)
    info = resp.read().decode('utf-8').split(':')
    username   = info[1].split('=')[1]
    yhm        = info[2].split('=')[1]
    name       = info[3].split('=')[1]
    usertype   = info[4].split('=')[1]
    department = info[5].split('=')[1]
    email      = info[6].split('=')[1]

    users = User.objects.filter(username=username)
    if len(users) > 0:
        user = users[0]
    else:
        user = User.objects.create_user(username=username, password=username)
        suser = SUser.objects.create(uid=user.id, username=username, yhm=yhm, name=name, usertype=usertype, department=department, email=email)
    user = auth.authenticate(username=username, password=username)
    auth.login(request, user)
    return HttpResponseRedirect('/index/')

def login2(request):
	rdata, op, suser = Utils.get_request_basis(request)
	
	if op == 'get_magic_number':
		return HttpResponse(json.dumps({'magic_number': Utils.MAGIC_NUMBER}))

	username = request.POST.get('username')
	password = request.POST.get('password')
	if username is not None and password is not None:
		password = Utils.uglyDecrypt(password)
		# 判断是否存在
		susers = SUser.objects.filter(username=username)
		print(susers)
		if len(susers) == 0:
			rdata['info'] = '用户名不存在'
		else:
			# 验证
			user = auth.authenticate(username=username, password=password)
			if user is not None:
				auth.login(request, user)
				rdata['login'] = True
				rdata['suser'] = suser = SUser.objects.get(uid=request.user.id)
				return HttpResponseRedirect('/index/')
			else:
				rdata['info'] = '密码错误'

	return render(request, 'login2.html', rdata)

def show_files(request, pageid=0):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None:
		return render(request, 'permission_denied.html')

	study_list = json.loads(suser.study_list)
	foreigner = rdata['foreigner']

	if op == 'view':
		filename = request.POST.get('filename')
		if not filename in study_list:
			study_list.append(filename)
		study_finish = True

		if foreigner:
			study_must_list = Utils.study_must_en
		else:
			study_must_list = Utils.study_must

		for doc in study_must_list:
			if not doc in study_list:
				study_finish = False
		SUser.objects.filter(id=suser.id).update(study_list=json.dumps(study_list), study_finish=study_finish)
		return HttpResponse('{}')

	rdata['pageid'] = int(pageid)
	rdata['docs_n'] = [{'doc': doc[0], 'doc_en': doc[1], 'view': doc[0] in study_list, 'must': (doc[0] in Utils.study_must) and (not foreigner)} for doc in Utils.study_n]
	rdata['docs_s'] = [{'doc': doc[0], 'doc_en': doc[1], 'view': doc[0] in study_list, 'must': (doc[0] in Utils.study_must) and (not foreigner)} for doc in Utils.study_s]
	rdata['docs_v'] = [{'doc': doc, 'doc_en': Utils.study_v[doc][1], 'view': doc in study_list, 'must': (doc in Utils.study_must) and (not foreigner), 'url': Utils.study_v[doc][0]} for doc in Utils.study_v]
	rdata['docs_en'] = [{'doc': doc, 'view': doc in study_list, 'must': (doc in Utils.study_must_en) and (foreigner)} for doc in Utils.study_en]

	return render(request, 'show_files.html', rdata)

def backend(request):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None or suser.admin == False:
		return render(request, 'permission_denied.html')

	rdata['test_num'] = test_num = Question.objects.all()[0].test_num
	rdata['answers'] = answers = Answer.objects.all()
	rdata['n_answers'] = len(answers)

	if op == 'change_test_num':
		new_test_num = int(request.POST.get('new_test_num'))
		Question.objects.update(test_num=new_test_num)
		return HttpResponse('{}')

	if op == 'download_submitted':
		filename = 'media/' + time.strftime('%Y%m%d%H%M%S') + '-填写用户名单.csv'
		f = open(filename, 'w', encoding='gbk')
		f.write('学号,姓名,院系,得分,填写时间\n')
		for answer in answers:
			f.write(answer.username + ',,,' + str(answer.score) + ',' + str(answer.create_time) + '\n')
		f.close()
		return HttpResponse(json.dumps({'export_path': filename}))

	return render(request, 'backend.html', rdata)

def add_user(request, username):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None or suser.username != 'root':
		return render(request, 'permission_denied.html')

	password = username
	user = auth.authenticate(username=username, password=password)
	admin = False
	if username == 'root': admin = True
	if user is None:
		user = User.objects.create_user(username=username, password=password)
		suser = SUser.objects.create(username=username, uid=user.id, admin=admin)
		html = 'add ' + username + ' successful'
	else:
		html = username + ' already exists'
	return HttpResponse(html)

def delete_user(request, username):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None or suser.username != 'root':
		return render(request, 'permission_denied.html')

	users = User.objects.filter(username=username)
	if len(users) > 0: users[0].delete()
	susers = SUser.objects.filter(username=username)
	html = 'no such user ' + username
	if len(susers) > 0:
		susers[0].delete()
		html = 'delete ' + username + ' successful'
	return HttpResponse(html)
