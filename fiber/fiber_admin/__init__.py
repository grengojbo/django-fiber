# MPTTModelAdmin is unused, but should stay since its import from here
# has been referenced in documentation.
from django.contrib import admin
from .options import ModelAdmin, MPTTModelAdmin
import logging
# Get an instance of a logger
logger = logging.getLogger(__name__)

class FiberAdminSite(admin.AdminSite):

    def register(self, model_or_iterable, admin_class=None, **options):
        logger.debug("FiberAdminSite")
        if not admin_class:
            admin_class = ModelAdmin
        return super(FiberAdminSite, self).register(model_or_iterable, admin_class=admin_class, **options)


site = FiberAdminSite(name='fiber_admin')
