# -*- mode: python; coding: utf-8; -*-
from settings_default import *

TIME_ZONE = 'Europe/Kiev'
LANGUAGE_CODE = 'ru-ru'
#LOCALE_PATHS = (os.path.join(PROJECT_ROOT, 'locale'),)
MODELTRANSLATION_DEFAULT_LANGUAGE = 'ru'

DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'testproject_db',                # Or path to database file if using sqlite3.
        'USER': '',                              # Not used with sqlite3.
        'PASSWORD': '',                          # Not used with sqlite3.
        'HOST': '',                              # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                              # Set to empty string for default. Not used with sqlite3.
    }
}

DEV = False

if DEV:
    INSTALLED_APPS = INSTALLED_APPS + ['debug_toolbar']
    MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + ('debug_toolbar.middleware.DebugToolbarMiddleware',)
    INTERNAL_IPS = ('127.0.0.1',)
    DEBUG_TOOLBAR_PANELS = (
        'debug_toolbar.panels.version.VersionDebugPanel',
        'debug_toolbar.panels.timer.TimerDebugPanel',
        'debug_toolbar.panels.settings_vars.SettingsVarsDebugPanel',
        'debug_toolbar.panels.headers.HeaderDebugPanel',
        'debug_toolbar.panels.request_vars.RequestVarsDebugPanel',
        'debug_toolbar.panels.template.TemplateDebugPanel',
        'debug_toolbar.panels.sql.SQLDebugPanel',
        'debug_toolbar.panels.cache.CacheDebugPanel',
        'debug_toolbar.panels.logger.LoggingPanel',
    )
    DEBUG_TOOLBAR_CONFIG = {
        'EXCLUDE_URLS': ('/admin',),
        'INTERCEPT_REDIRECTS': False,
    }

# CACHEOPS_REDIS = {
#     'host': 'localhost',  # redis-server is on same machine
#     'port': 6379,        # default redis port
#     'db':0,             # SELECT non-default redis database
#     # using separate redis db or redis instance
#     # is highly recommended
#     'socket_timeout': 3,
#     'password': '',
# }
#
# CACHEOPS_DEGRADE_ON_FAILURE = True
# CACHEOPS = {
#     # Automatically cache any User.objects.get() calls for 15 minutes
#     # This includes request.user or post.author access,
#     # where Post.author is a foreign key to auth.User
#     'auth.user': ('get', 60*15),
#
#     # Automatically cache all gets, queryset fetches and counts
#     # to other django.contrib.auth models for an hour
#     'auth.*': ('all', 60*60),
#
#     # Enable manual caching on all news models with default timeout of an hour
#     # Use News.objects.cache().get(...)
#     #  or Tags.objects.filter(...).order_by(...).cache()
#     # to cache particular ORM request.
#     # Invalidation is still automatic
#     #'news.*': ('just_enable', 60*60),
#
#     # Automatically cache count requests for all other models for 15 min
#     '*.*': ('count', 60*15),
# }

# Enable these options for memcached
#CACHE_BACKEND= "memcached://127.0.0.1:11211/"
#CACHE_MIDDLEWARE_ANONYMOUS_ONLY=True

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake'
    }
    # 'default': {
    #     'BACKEND': 'redis_cache.RedisCache',
    #     'LOCATION': '127.0.0.1:6379',
    #     'OPTIONS': {
    #         'DB': 0,
    #         'PASSWORD': 'passwd',
    #         'PARSER_CLASS': 'redis.connection.HiredisParser',
    #         'MAX_ENTRIES': 1000
    #     },
    # }
}

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_USE_TLS = True
# EMAIL_HOST = 'smtp.yandex.ru'
# EMAIL_HOST_USER = 'web@yandex.ru'
# EMAIL_HOST_PASSWORD = 'password'
# EMAIL_PORT = 587
# DEFAULT_FROM_EMAIL = "web@yandex.ru"
# SERVER_EMAIL = "web@yandex.ru"
# SYSTEM_EMAIL_PREFIX = "[Django-Fiber]"

## Compress
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = False
# COMPRESS_PRECOMPILERS = (
#     ('text/less', 'lessc DjangoApp/base/static/less/aplication.less DjangoApp/base/static/css/aplication.css')
# )