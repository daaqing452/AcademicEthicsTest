from django.db import models

class SUser(models.Model):
	uid = models.IntegerField()
	username = models.CharField(max_length=64)
	admin = models.BooleanField(default=0)
	study_list = models.TextField(default='[]')
	study_finish = models.BooleanField(default=0)