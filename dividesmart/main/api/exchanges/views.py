from django.http import HttpResponse


def exchanges(request):
    return HttpResponse(request.path)


def exchange(request, id):
    return HttpResponse(request.path)
