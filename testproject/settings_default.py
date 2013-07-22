# -*- mode: python; coding: utf-8; -*-
"""
This is your project's main settings file that can be committed to your
repo. If you need to override a setting locally, use local.py
"""

__author__ = 'jbo'

import django
import os
import sys
import logging
#import django.conf.global_settings as DEFAULT_SETTINGS
#import memcache_toolbar.panels.memcache

# Your project root
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__) + "../../")

PYTHON_VERSION = '%s.%s' % sys.version_info[:2]
DJANGO_VERSION = django.get_version()
#path = lambda *a: os.path.join(ROOT, *a)

SUPPORTED_NONLOCALES = ['media', 'admin', 'static']

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

gettext = lambda s: s

LANGUAGES = (
    ('en', gettext('English')),
    #('fr', gettext('French')),
    #('es', gettext('Spanish')),
    #('pt', gettext('Portuguese')),
    #('de', gettext('German')),
    ('ru', gettext('Russian')),
    ('uk', gettext('Ukraine')),
)

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.example.com/media/"
MEDIA_ROOT = FILEBROWSER_MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'testproject/public/media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.example.com/media/", "http://example.com/media/"
MEDIA_URL = FILEBROWSER_MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.example.com/static/"
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'testproject/public/static')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    'testproject/static',
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
    #'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '%-$o$r0p4xqkwx)w$$r2-r^s9%%a^7$d76ygv2s+2*lxv+g+yc'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    #'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'fiber.middleware.ObfuscateEmailAddressMiddleware',
    'fiber.middleware.AdminPageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'django.middleware.cache.FetchFromCacheMiddleware',
)

ROOT_URLCONF = 'testproject.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'testproject.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or
    # "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_ROOT, 'testproject/templates'),
)

# List of callables that know how to import templates from various sources.

FIXTURE_DIRS = (
    os.path.join(PROJECT_ROOT, 'fiber/fixtures'),
)
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.media',
    'django.core.context_processors.request',
    'django.core.context_processors.i18n',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.csrf',
)
INSTALLED_APPS = [
    # 'cacheops',
    'mptt',
    'compressor',
    'fiber',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    'django.contrib.markup',
    'django.contrib.humanize',
    'django.contrib.syndication',
    'django.contrib.staticfiles',
    'south',
    'guardian',
    # 'sorl.thumbnail',
    'rest_framework',
    #"django_any",
    'modeltranslation',
    'fiber_modeltranslation'
]

FILE_UPLOAD_PERMISSIONS = 0664

SOUTH_TESTS_MIGRATE = False

APPEND_SLASH = False

API_RENDER_HTML = False
FIBER_TEMPLATE_CHOICES = (
    ('', 'Default template'),
    ('tpl-default.html', 'Django block'),
)
FIBER_CONTENT_TEMPLATE_CHOICES = (
    ('', 'Default template'),
    ('special-content-template.html', 'Special template'),
)
FIBER_METADATA_CONTENT_SCHEMA = FIBER_METADATA_PAGE_SCHEMA = {
    'title': {
        'widget': 'select',
        'values': ['option1', 'option2', 'option3'],
    },
    'bgcolor': {
        'widget': 'combobox',
        'values': ['#ffffff', '#fff000', '#ff00cc'],
        'prefill_from_db': True,
    },
    'description': {
        'widget': 'textarea',
    },
}

REST_FRAMEWORK = {
    #'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    #'FILTER_BACKEND': 'rest_framework.filters.DjangoFilterBackend',
    'PAGINATE_BY': 50
}

try:
    import django_jenkins
    INSTALLED_APPS = INSTALLED_APPS + ['django_jenkins']
except ImportError:
    pass

# Django extensions
try:
    import django_extensions
except ImportError:
    pass
else:
    INSTALLED_APPS = INSTALLED_APPS + ['django_extensions']

JENKINS_TASKS = (
    'django_jenkins.tasks.with_coverage',
    'django_jenkins.tasks.django_tests',
)

try:
    import gunicorn
except ImportError:
    pass
else:
    INSTALLED_APPS = INSTALLED_APPS + ['gunicorn']

# Add the Guardian authentication backends
AUTHENTICATION_BACKENDS = (
    'guardian.backends.ObjectPermissionBackend',
    'django.contrib.auth.backends.ModelBackend',
)

# Needed for Django guardian
ANONYMOUS_USER_ID = -1

## Log settings

LOG_LEVEL = logging.INFO
LOG_COLORSQL_ENABLE = True
LOG_COLORSQL_VERBOSE = True
#HAS_SYSLOG = True
#SYSLOG_TAG = "http_app_DjangoApp"  # Make this unique to your project.
# Remove this configuration variable to use your custom logging configuration
#LOGGING_CONFIG = None
# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'DEBUG',
        'handlers': ['default'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(asctime)s %(levelname)s || %(message)s'
        }
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
           'class': 'django.utils.log.AdminEmailHandler',
           'level': 'ERROR',
           # But the emails are plain text by default - HTML is nicer
           'include_html': True,
           'filters': ['require_debug_false']
        },
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'default': {
            'class': 'logging.handlers.WatchedFileHandler',
            'filename': 'log/django-app.log',
            'formatter': 'verbose',
        },
        'default-db': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'log/django-app-db.log',
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 20,
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'fiber': {
            'handlers': ['default', 'console'],
            'level': 'DEBUG',
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django': {
            'handlers': ['default', 'console'],
            'propagate': False,
            'level': 'DEBUG',
        },
        'django.db.backends': {
            'handlers': ['default-db'],
            'level': 'ERROR',
            'propagate': False,
        },
    }
}


# Only run tests for fiber app
PROJECT_APPS = ['fiber']