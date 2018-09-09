from django.http import HttpResponse


def users(request):
    return HttpResponse(request.path)


def user(request, id):
    return HttpResponse(request.path)

