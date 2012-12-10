import random
import re

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.template import loader, RequestContext
from django.utils.encoding import smart_unicode
from django.utils import simplejson

from .app_settings import LOGIN_STRING, EXCLUDE_URLS, EDITOR
from .models import ContentItem, Page
from .utils.import_util import import_element


class AdminPageMiddleware(object):
    body_re = re.compile(
        r"<head>(?P<IN_HEAD>.*)</head>(?P<AFTER_HEAD>.*)<body(?P<IN_BODY_TAG>.*?)>(?P<BODY_CONTENTS>.*)</body>",
        re.DOTALL,
    )

    def __init__(self):
        self.editor_settings = self.get_editor_settings()

    def process_response(self, request, response):
        # only process html and xhtml responses
        if response['Content-Type'].split(';')[0] not in ('text/html', 'application/xhtml+xml'):
            return response

        elif self.is_login_url(request):
            return self.redirect_to_fiber_admin(request)
        elif self.must_display_admin(request, response):
            return self.inject_fiber_admin(request, response)
        else:
            return response

    def inject_html(self, html, header='', body_prepend='', body_append='', fiber_data=None):
        """
        Inject html.

        - header: will be appended to the header
        - body_prepend: will be prepended to the body
        - body_append: will be appended to the body
        - fiber_data: will be serialized to json and put in 'data-fiber-data' element
        """
        if not fiber_data:
            fiber_data = {}

        return self.body_re.sub(
            r"<head>\g<IN_HEAD>%s</head>\g<AFTER_HEAD><body data-fiber-data='%s'\g<IN_BODY_TAG>>%s\g<BODY_CONTENTS>%s</body>" % (header, simplejson.dumps(fiber_data), body_prepend, body_append),
            smart_unicode(html)
        )

    def is_login_url(self, request):
        """
        Is this the login url? By default this is '@fiber'.
        """
        path_info = request.path_info
        query_string = request.META['QUERY_STRING'] or ''

        return path_info.endswith(LOGIN_STRING) or query_string.endswith(LOGIN_STRING)

    def must_display_admin(self, request, response):
        """
        Must the fiber admin be displayed?
        - has a response status code of 200
        - is performed by an admin user or the session contains 'show_fiber_admin'
        - has a response which is either 'text/html' or 'application/xhtml+xml'
        - is not an AJAX request
        - does not match EXCLUDE_URLS (empty by default)
        """
        if response.status_code != 200:
            return False
        if not hasattr(request, 'user'):
            return False
        if response['Content-Type'].split(';')[0] not in ('text/html', 'application/xhtml+xml'):
            return False
        if request.is_ajax():
            return False
        if EXCLUDE_URLS:
            for exclude_url in EXCLUDE_URLS:
                if re.search(exclude_url, request.path_info.lstrip('/')):
                    return False

        return (
            request.session.get('show_fiber_admin') or
            hasattr(request, 'user') and request.user.is_staff
        )

    def is_django_admin(self, request):
        return re.search(r'^%s' % (reverse('admin:index').lstrip('/')), request.path_info.lstrip('/'))

    def get_header_html(self, request):
        t = loader.get_template('fiber/header.html')
        c = RequestContext(
            request,
            {
                'editor_template_js': self.editor_settings.get('template_js'),
                'editor_template_css': self.editor_settings.get('template_css'),
                'BACKEND_BASE_URL': reverse('admin:index'),
            },
        )
        return t.render(c)

    def get_logout_url(self, request):
        if request.META['QUERY_STRING']:
            return '%s?next=%s?%s' % (reverse('admin:logout'), request.path_info, request.META['QUERY_STRING'])
        else:
            return '%s?next=%s' % (reverse('admin:logout'), request.path_info)

    def get_editor_settings(self):
        return import_element(EDITOR)

    def redirect_to_fiber_admin(self, request):
        """
        Redirect to page with fiber admin. This is done by setting 'show_fiber_admin' in the session and redirecting to the same page.

        The result is a http response.
        """
        request.session['show_fiber_admin'] = True
        url_without_fiber = request.path_info.replace(LOGIN_STRING, '')
        querystring_without_fiber = ''
        if request.META['QUERY_STRING']:
            querystring_without_fiber = request.META['QUERY_STRING'].replace(LOGIN_STRING, '')
        if querystring_without_fiber:
            querystring = '?%s' % querystring_without_fiber
        else:
            querystring = ''

        return HttpResponseRedirect('%s%s' % (url_without_fiber, querystring))

    def inject_fiber_admin(self, request, response):
        """
        Injects the fiber admin. Returns http response.
        """
        # Show the login window once
        request.session['show_fiber_admin'] = False

        logged_in=request.user.is_staff

        fiber_data = dict(
            logged_in=logged_in,
            login_url=reverse('fiber_login'),
        )
        body_prepend = ''
        body_append = ''

        if self.is_django_admin(request):
            fiber_data['backend'] = True
        elif not logged_in:
            fiber_data['frontend'] = True
        else:
            t = loader.get_template('fiber/admin.html')
            c = RequestContext(request, {
                'logout_url': self.get_logout_url(request),
                'pages_json': simplejson.dumps(
                    Page.objects.create_jqtree_data(request.user)
                ),
                'content_items_json': simplejson.dumps(
                    ContentItem.objects.get_content_groups(request.user)
                )
            })

            body_prepend = '<div id="wpr-body">'
            body_append = '</div>%s' % t.render(c)

            fiber_data['frontend'] = True
            try:
                fiber_data['page_id'] = Page.objects.get_by_url(request.path_info).pk
            except AttributeError:
                pass

        # Inject header and body.
        # Add fiber-data attribute to body tag.
        response.content = self.inject_html(
            response.content,
            header=self.get_header_html(request),
            body_prepend=body_prepend,
            body_append=body_append,
            fiber_data=fiber_data
        )
        return response


class ObfuscateEmailAddressMiddleware(object):

    def process_response(self, request, response):
        # http://www.lampdocs.com/blog/2008/10/regular-expression-to-extract-all-e-mail-addresses-from-a-file-with-php/
        email_pattern = re.compile(r'(mailto:)?[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))')
        if response['Content-Type'].split(';')[0] in ('text/html', 'application/xhtml+xml'):
            response.content = email_pattern.sub(self.encode_string_repl, response.content)
        return response

    def encode_string_repl(self, email_pattern_match):
        encoded_char_list = []
        for char in email_pattern_match.group(0):
            encoded_char_list.append(random.choice(['&#%d;' % ord(char), '&#x%x;' % ord(char)]))

        return ''.join(encoded_char_list)
