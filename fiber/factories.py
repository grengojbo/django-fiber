# -*- mode: python; coding: utf-8; -*-

import factory
from django.contrib.auth.models import User
from models import Page, ContentItem, PageContentItem


# Фабрика для создания обычного пользователя
class UserFactory(factory.django.DjangoModelFactory):
    FACTORY_FOR = User
    FACTORY_DJANGO_GET_OR_CREATE = ('username',)

    username = factory.LazyAttributeSequence(lambda a, n: 'username_{0}'.format(n))
    first_name = factory.LazyAttributeSequence(lambda a, n: 'first_name_{0}'.format(n))
    last_name = factory.LazyAttributeSequence(lambda a, n: 'last_name_{0}'.format(n))

    email = factory.LazyAttributeSequence(lambda a, n: 'person{0}@example.com'.format(n))
    password = "password"

    is_staff = False
    is_active = True
    is_superuser = False

    @classmethod
    def _prepare(cls, create, **kwargs):
        password = kwargs.pop('password', None)
        user = super(UserFactory, cls)._prepare(create, **kwargs)
        if password:
            user.set_password(password)
            if create:
                user.save()
        return user

    # @classmethod
    # def _setup_next_sequence(cls):
    #     return cls._associated_class.objects.values_list('id').order_by('-id')[0] + 1

    #email = factory.Sequence(lambda n: 'person{0}@example.com'.format(n))


# Фабрика для создания привилегированного пользователя
class AdminFactory(factory.Factory):
    FACTORY_FOR = User

    first_name = 'Admin'
    last_name = 'User'
    admin = True


class PostFactory(factory.Factory):
    FACTORY_FOR = Page
    #author = factory.LazyAttribute(lambda a: UserFactory())
    title = 'Title article'
    url = 'articles'


class ContentItemFactory(factory.Factory):
    FACTORY_FOR = ContentItem
    #author = factory.LazyAttribute(lambda a: UserFactory())
    name = 'Title item'
    url = 'articles'


def genUser():
    for i in range(5):
        UserFactory()

def genPost():
    for i in range(5):
        post = PostFactory()




