from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import simplejson
from django.contrib.auth.views import login as auth_login

from .models import Page


def fiber_login(request):
    response = auth_login(request, template_name = 'fiber/login.html')

    if request.method != 'POST':
        # Initial request
        return response
    elif response.status_code == 200:
        # Login failed; return response with error status
        response.status_code = 400
        return response
    elif response.status_code == 302:
        # Login successfull; return response with success status
        return HttpResponse()
    else:
        # Unknown status
        return response


@staff_member_required
def page_move_up(request, id):
    page = Page.objects.get(pk=id)

    if page:
        previous_sibling_page = page.get_previous_sibling()
        if previous_sibling_page:
            page.move_to(previous_sibling_page, position='left')

    return HttpResponseRedirect('../../')


@staff_member_required
def page_move_down(request, id):
    page = Page.objects.get(pk=id)

    if page:
        next_sibling_page = page.get_next_sibling()
        if next_sibling_page:
            page.move_to(next_sibling_page, position='right')

    return HttpResponseRedirect('../../')


@staff_member_required
def pages_json(request):
    """
    Returns page tree as json. The data is suitable for jqtree.
    """
    return HttpResponse(
        simplejson.dumps(
            Page.objects.create_jqtree_data(request.user)
        )
    )
