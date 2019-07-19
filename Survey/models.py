from django.db import models

class Question(models.Model):
	question = models.TextField(default='[]')

class Answer(models.Model):
	uid = models.IntegerField(default=-1)
	astring = models.TextField(default='[]')
	score = models.IntegerField(default=0)