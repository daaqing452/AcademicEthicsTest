from django.db import models

class Question(models.Model):
	founder = models.CharField(max_length=64, default='')
	question = models.TextField(default='')
