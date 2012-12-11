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
            @$el.bind('tree.click', $.proxy(@handleClick, this))

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

        handleClick: (e) ->
            node = e.node

            if node.url
                window.location = node.url


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
            super()

        remove: ->
            if @$el
                @$el.remove()
            @$el = null


    class EditPageView extends Util.ModalFormView
        when:
            mode: 'edit_page'

        id: 'edit-page'
        title: 'Edit page'
        submit_title: 'Save'

        render: ->
            $body = @$el.find('.modal-body')
            url = @getUrl()
            $body.load("#{ url } #page_form", $.proxy(@initForm, this))

            super()

        getUrl: ->
            page_id = @model.get('page_id')
            return "/admin/fiber/fiber_admin/fiber/page/#{ page_id }/"

        initForm: ->
            @$el.find('div.submit-row').remove()
            @$el.find('form').attr('action', @getUrl())

        handleSubmitSuccess: (response) ->
            Backbone.history.navigate('', trigger: true)


    class EditContentItemView extends Util.ModalFormView
        when:
            mode: 'edit_content_item'

        id: 'edit-content'
        title: 'Edit content'
        submit_title: 'Save'

        render: ->
            $body = @$el.find('.modal-body')
            url = @getUrl()
            $body.load("#{ url } #contentitem_form", $.proxy(@initForm, this))

            super()

        getUrl: ->
            content_item_id = @model.get('content_item_id')
            return "/admin/fiber/fiber_admin/fiber/contentitem/#{ content_item_id }/"

        initForm: ->
            @$el.find('div.submit-row').remove()
            @$el.find('form').attr('action', @getUrl())

        handleSubmitSuccess: (response) ->
            Backbone.history.navigate('', trigger: true)


    class LoginView extends Util.ModalFormView
        when:
            mode: 'login'

        id: 'login-form'
        title: 'Fiber login'
        submit_title: 'Login'

        constructor: (options) ->
            @model = options.model

            super(options)

        handleSubmitSuccess: (response) ->
            window.location = '/'


    class FiberRouter extends Backbone.Router
        routes:
            '': 'index'
            'login': 'login'
            'edit-page/:page_id': 'editPage'
            'edit-content/:content_item_id': 'editContentItem'

        initialize: (options) ->
            @model = options.model

            Backbone.history.start()

        editPage: (page_id) ->
            @model.set(
                'mode': 'edit_page'
                'page_id': page_id
                'context_menu': null
            )

        login: ->
            @model.set('mode': 'login')

        index: ->
            @model.set('mode': 'index')

        editContentItem: (content_item_id) ->
            @model.set(
                'mode': 'edit_content_item'
                'content_item_id': content_item_id
            )


    class FiberItem
        constructor: ($element) ->
            @element = $element[0]
            @element_data = $element.data('fiber-data')

            @parent = null
            @children = []
            @button = null

        add_child: (fiber_item) ->
            @children.push(fiber_item)
            fiber_item.parent = this

        post_init: ->
            # Set minimum height of (possibly empty) containers
            # TODO: also do this for menus?
            if @element_data.type == 'content_item' and not @parent
                $(@element).css('min-height', '20px')

            @attach_events()

        attach_events: ->
            $element = $(@element)

            $element.hover(
                $.proxy(@on_mouseenter, this),
                $.proxy(@on_mouseleave, this)
            )

            $element.dblclick($.proxy(@on_dblclick, this))

        on_mouseenter: (e) ->
            # Bubble mouseenter to containers
            e.stopPropagation()

            if @parent
                $(@parent.element).trigger('mouseenter')
            else
                @show_admin_elements()

        on_mouseleave: (e) ->
            # Bubble mouseleave to containers
            e.stopPropagation()

            if @parent
                $(@parent.element).trigger('mouseleave')
            else
                @hide_admin_elements()

        on_dblclick: ->
            @edit_content_item()
            return false

        show_admin_elements: ->
            x = 0

        hide_admin_elements: ->
            x = 0

        edit_content_item: ->
            if @element_data.can_edit
                content_item_id = @element_data.id
                Backbone.history.navigate("edit-content/#{ content_item_id }", trigger: true)


    class FiberItemCollection
        constructor: ->
            @all_fiber_items = []

            for fiber_element in @get_fiber_elements()
                fiber_item = @create_fiber_item($(fiber_element))
                @all_fiber_items.push(fiber_item)

            for fiber_item in @all_fiber_items
                fiber_item.post_init()

        get_fiber_elements: ->
            page_divs = $(document.body).children(':visible').not('#df-wpr-layer, #df-wpr-sidebar')
            return page_divs.find('[data-fiber-data]')

        create_fiber_item: ($element) ->
            fiber_item = new FiberItem($element)

            # Find closest parent, and see if it is already a FiberItem
            $parent = $element.parent().closest('[data-fiber-data]:not(body)')

            if $parent.length
                parent_item = @find_item_by_element($parent[0])

                if not parent_item
                    parent_item = @create_fiber_item($parent)

                parent_item.add_child(fiber_item)

            return fiber_item

        find_item_by_element: (element) ->
            for fiber_item in @all_fiber_items
                if fiber_item.element == element
                    return fiber_item

            return null


    Fiber.init_admin = ->
        fiber_data = $('body').data('fiber-data')

        ui_state = new Backbone.Model(
            'fiber_data': fiber_data
        )

        new SidebarView(model: ui_state)
        new ContextMenuView(model: ui_state)
        new EditPageView(model: ui_state)
        new LoginView(model: ui_state)
        new EditContentItemView(model: ui_state)

        new FiberRouter(model: ui_state)

        new FiberItemCollection()

        if not fiber_data.logged_in
            Backbone.history.navigate('login', trigger: true)
)