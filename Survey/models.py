from django.db import models

class Question(models.Model):
	question = models.TextField(default='')
