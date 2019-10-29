from django.db import models

class SUser(models.Model):
    uid = models.IntegerField()
    username = models.CharField(max_length=64)
    yhm = models.CharField(max_length=64, default='')
    name = models.CharField(max_length=64, default='')
    usertype = models.CharField(max_length=64, default='')
    department = models.CharField(max_length=64, default='')
    email = models.CharField(max_length=64, default='')

    admin = models.BooleanField(default=0)
    study_list = models.TextField(default='[]')
    study_finish = models.BooleanField(default=0)
    qstring = models.TextField(default='[]')
