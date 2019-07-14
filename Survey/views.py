from django.shortcuts import render

# Create your views here.


def survey(request):
	return render(request, "survey.html")