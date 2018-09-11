from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout


@csrf_exempt
def handle_login(request):
    if request.method != 'POST':
        return HttpResponseNotFound()
    # validate request (email and pw), just send some error message 404
    email_address = request.POST['email_address']
    password = request.POST['password']
    user = authenticate(email_address=email_address, password=password)
    if not user:
        return HttpResponse('Invalid email or password', status=401)
    if not user.is_active:
        return HttpResponse('Inactive account', status=404)
    login(request, user)
    return HttpResponse("logged in as: %s" % user.email_address)


def handle_logout(request):
    logout(request)
    return HttpResponse("logged out")
