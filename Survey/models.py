from django.db import models

class Question(models.Model):
	question = models.TextField(default='[]')

class Answer(models.Model):
	username = models.CharField(max_length=64, default='')
	astring = models.TextField(default='[]')
	score = models.IntegerField(default=0)