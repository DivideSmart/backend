from django.http import HttpResponse


def groups(request):
    return HttpResponse(request.path)


def group(request, id):
    return HttpResponse(request.path)
