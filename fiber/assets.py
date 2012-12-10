from django_assets import Bundle, register


coffee = Bundle(
    'fiber/js/util.coffee',
    'fiber/js/fiber.coffee',
    filters='coffeescript',
    output='fiber/js/fiber.js'
)

register('fiber_coffee', coffee)