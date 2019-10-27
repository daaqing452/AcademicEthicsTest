from django.db import models

class SUser(models.Model):
    uid = models.IntegerField()
    username = models.CharField(max_length=64)
    # yhm = models.CharField(max_length=64)
    # name = models.CharField(max_length=64)
    # usertype = models.CharField(max_length=64)
    # department = models.CharField(max_length=64)
    # email = models.CharField(max_length=64)

    admin = models.BooleanField(default=0)
    study_list = models.TextField(default='[]')
    study_finish = models.BooleanField(default=0)
    qstring = models.TextField(default='[]')
