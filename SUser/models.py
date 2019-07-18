from django.db import models

class SUser(models.Model):
	uid = models.IntegerField()
	admin = models.BooleanField(default=0)