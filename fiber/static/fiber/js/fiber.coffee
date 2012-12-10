# Fiber namespace; this namespace is public
@Fiber = {}


runWithFiberJQuery(($) ->
    class SidebarView extends Backbone.View
        constructor: (options) ->
            @model = options.model

            super()

        initialize: ->
            @setElement($('#df-wpr-sidebar'))

            new PageTreeView(model: @model)
            new ContentTreeView(model: @model)


    class PageTreeView extends Backbone.View
        constructor: (options) ->
            @model = options.model

            super()

        initialize: ->
            @setElement($('#df-sidebar-page-tree'))
            @page_data = window.fiber_page_data

            @render()

        render: ->
            @$el.tree(
                data: @page_data
                autoOpen: 0
                saveState: 'fiber_pages'
                dragAndDrop: true
                selectable: true
                onCreateLi: $.proxy(@createLi, this)
            )

            @$el.bind('tree.contextmenu', $.proxy(@handleContextMenu, this))

        createLi: (node, $li) ->
            if node.change_url
                $div = $li.find('div')
                $li.find('.jqtree-title').before('<span class="icon"></span>')
                $div.addClass('page')

                if not node.show_in_menu
                    $div.addClass('hidden-in-menu')

                if not node.is_public
                    $div.addClass('non-public')

                if node.is_redirect
                    $div.addClass('redirect')

                if not node.editable
                    $div.addClass('non-editable')

        handleContextMenu: (e) ->
            node = e.node

            if not node.editable
                return

            position =
                left: e.click_event.pageX
                top: e.click_event.pageY

            items = [
                { title: 'Edit', url: "#edit-page/#{ node.id }" },
                { title: 'Delete', url: "#delete-page/#{ node.id }" }
            ]

            context_menu =
                position: position
                items: items

            @model.set('context_menu': context_menu)


    class ContentTreeView extends Backbone.View
        constructor: (options) ->
            @model = options.model

            super()

        initialize: ->
            @setElement($('#df-sidebar-content-tree'))
            @content_data = window.fiber_content_items_data

            @render()

        render: ->
            @$el.tree(
                data: @content_data
                saveState: 'fiber_content_items'
            )


    class ContextMenuView extends Util.ConditionalDisplayView
        when:
            context_menu__has_value: true

        events:
            'click a': 'handleClick'

        constructor: (options) ->
            @model = options.model

            super()

        initialize: ->
            super()

            $('html, body').bind(
                'click contextmenu',
                =>
                    @model.set('context_menu', null)
            )

        render: ->
            @remove()

            context_menu = @model.get('context_menu')

            $el = Util.render_template(null, 'contextmenu-template', items: context_menu.items)
            $(document.body).append($el)
            $el.offset(context_menu.position)

            @setElement($el)

        handleClick: (e) ->
            @remove()

            $target = $(e.target)
            url = $target.attr('href')

            if url
                Backbone.history.navigate(url, trigger: true)

            return false

        hide: ->
            @remove()

        remove: ->
            if @$el
                @$el.remove()
            @$el = null


    class EditPageView extends Util.ModalFormView
        when:
            mode: 'edit_page'

        render:
            x = 0


    class LoginView extends Util.ModalFormView
        when:
            mode: 'login'

        constructor: (options) ->
            @model = options.model

            super(options)

        renderOnce: ->
            login_url = @model.get('fiber_data').login_url
            html = "<div id=\"login-form\" class=\"modal hide\" data-remote=\"#{ login_url }\">"
            $el = $(html).appendTo('body')
            @setElement($el)

            Util.render_template(@$el, 'login-template')

        handleSubmitSuccess: (response) ->
            window.location = '/'    


    class FiberRouter extends Backbone.Router
        routes:
            '': 'index'
            'login': 'login'
            'edit-page/:page_id': 'editPage'

        initialize: (options) ->
            @model = options.model

            Backbone.history.start()

        editPage: (page_id) ->
            @model.set('mode': 'edit_page')

        login: ->
            @model.set('mode': 'login')

        index: ->
            @model.set('mode': 'index')


    Fiber.init_admin = ->
        fiber_data = $('body').data('fiber-data')

        ui_state = new Backbone.Model(
            'fiber_data': fiber_data
        )

        new FiberRouter(model: ui_state)
        new SidebarView(model: ui_state)
        new ContextMenuView(model: ui_state)
        new EditPageView(model: ui_state)
        new LoginView(model: ui_state)

        if not fiber_data.logged_in
            Backbone.history.navigate('login', trigger: true)
)