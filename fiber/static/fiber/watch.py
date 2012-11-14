import logging

from webassets import Environment, Bundle
from webassets.script import CommandLineEnvironment


env = Environment('js', 'js')

coffee_bundle = Bundle(
    'util.coffee',
    'fiber.coffee',
    'login.coffee',
    filters='coffeescript',
    output='fiber.js'
)

env.register('js', coffee_bundle)

log = logging.getLogger('webassets')
log.addHandler(logging.StreamHandler())
log.setLevel(logging.DEBUG)

cmdenv = CommandLineEnvironment(env, log)
cmdenv.clean()
cmdenv.build()
cmdenv.watch()
