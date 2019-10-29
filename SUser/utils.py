from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from SUser.models import *
from Survey.models import *

MAGIC_NUMBER = 1239874561

study_must = ['高等学校预防与处理学术不端行为办法', '普通高等学校学生管理规定', '清华大学学术道德规范', '清华大学预防与处理学术不端行为办法', ]
study_n = ['高等学校预防与处理学术不端行为办法', '普通高等学校学生管理规定', '教育部办公厅关于进一步规范和加强研究生培养管理的通知', '高等学校哲学社会科学研究学术规范', '关于进一步加强科研诚信建设的若干意见', '关于进一步弘扬科学家精神加强作风和学风建设的意见', '国家自然科学基金委员会监督委员会关于加强国家自然科学基金工作中科学道德建设的若干意见', ]
study_s = ['清华大学学术道德规范', '清华大学预防与处理学术不端行为办法', '学术道德与规范手册', '学术道德规范测试题(2019 版)', ]
# study_v = {'北师大印波老师《科研伦理与学术规范》': 'http://www.xuetangx.com/courses/course-v1:BNU+2017053101X+2019_T1/about', '清华《学术之道》': 'http://www.xuetangx.com/courses/course-v1:TsinghuaX+10690012+2019_T1/about', '清华《研究生学术与职业素养讲座》': 'http://www.xuetangx.com/courses/course-v1:TsinghuaX+Thu02016001+2016_T1/about'}
study_v = {'清华《学术之道》': 'http://www.xuetangx.com/courses/course-v1:TsinghuaX+10690012+2019_T1/about', '清华《研究生学术与职业素养讲座》': 'http://www.xuetangx.com/courses/course-v1:TsinghuaX+Thu02016001+2016_T1/about'}

def uglyDecrypt(s):
	t = ''
	for i in range(0, len(s), 7):
		x = 0
		tt = ''
		for j in range(6, -1, -1):
			y = ord(s[i+j]) - 97
			x = x * 26 + y
		x = x ^ MAGIC_NUMBER
		for i in range(3):
			y = x % 1000
			if y > 0: tt = chr(y) + tt
			x = x // 1000
		t += tt
	return t

def get_request_basis(request):
	rdata = {}
	op = request.POST.get('op', '')
	suser = None
	if request.user.is_authenticated:
		rdata['suser'] = suser = SUser.objects.filter(username=request.user.username)[0]
	return rdata, op, suser
