from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from SUser.models import *
from Survey.models import *

def get_request_basis(request):
	rdata = {}
	op = request.POST.get('op', '')
	suser = None
	if request.user.is_authenticated:
		rdata['suser'] = suser = SUser.objects.filter(username=request.user.username)[0]
	return rdata, op, suser