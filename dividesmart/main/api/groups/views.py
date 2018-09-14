from django.http import (
    HttpResponse, HttpResponseNotFound, HttpResponseBadRequest
)
from django.views.decorators.csrf import csrf_exempt
from main.utils import ensure_authenticated
from main.forms import CreateGroupForm
from main.models import Group
from django.contrib.auth import get_user


@csrf_exempt
@ensure_authenticated
def groups(request):
    if request.method == 'POST':
        current_user = get_user(request)
        form = CreateGroupForm(request.POST)
        if not form.is_valid():
            return HttpResponseBadRequest('Invalid parameters')
        Group.objects.create_group(form.cleaned_data['name'], current_user)
        return HttpResponse('group created')
    return HttpResponseNotFound('Invalid request')


def group(request, id):
    return HttpResponse(request.path)
