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

def index(request):
	rdata, op, suser = Utils.get_request_basis(request)
	
	if op == 'get_magic_number':
		return HttpResponse(json.dumps({'magic_number': Utils.MAGIC_NUMBER}))

	if op == 'logout':
		auth.logout(request)
		return HttpResponse('{}');

	username = request.POST.get('username')
	password = request.POST.get('password')

	if username is not None and password is not None:
		password = Utils.uglyDecrypt(password)

		# 判断是否存在
		susers = SUser.objects.filter(username=username)
		existed = (len(susers) > 0)

		# 判断是否是清华账号
		if username.isdigit() and len(username) == 10:
			pass

		if not existed:
			rdata['info'] = '用户名不存在'
		else:
			# 验证
			user = auth.authenticate(username=username, password=password)
			if user is not None:
				auth.login(request, user)
				rdata['login'] = True
				rdata['suser'] = suser = SUser.objects.get(uid=request.user.id)
				login = True
			else:
				rdata['info'] = '密码错误'
	
	else:
		if suser is None:
			rdata['login'] = False
		else:
			rdata['login'] = True

	return render(request, 'index.html', rdata)

def show_files(request):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None:
		return render(request, 'permission_denied.html')

	rdata['files'] = files = os.listdir('media')

	return render(request, 'show_files.html', rdata)

def backend(request):
	rdata, op, suser = Utils.get_request_basis(request)
	if suser is None or suser.admin == False:
		return render(request, 'permission_denied.html')

	rdata['test_num'] = test_num = Question.objects.all()[0].test_num
	rdata['answers'] = answers = Answer.objects.all()

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