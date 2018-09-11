from django.http import HttpResponseNotFound, HttpResponse


def users(request):
    if request.method == 'POST':
        return HttpResponse(request.path)
    return HttpResponseNotFound()


def user(request, id):
    return HttpResponse(request.path)

