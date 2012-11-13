runWithFiberJQuery(($) ->
    ui_state = new Backbone.Model()


    class ModalView extends Backbone.View
        events:
            'click .submit': 'submit'

        render: ->
            @$el.modal()

        getForm: ->
            return @$el.find('form')

        submit: ->
            @getForm().ajaxSubmit(
                success: $.proxy(@handleSubmitSuccess, this)
                error: $.proxy(@handleSubmitError, this)
            )

        handleSubmitSuccess: (response) ->
            # override

        handleSubmitError: (response) ->
            @getForm().replaceWith(response.responseText)


    class LoginView extends ModalView
        render: ->
            html = "<div id=\"login-form\" class=\"modal hide\" data-remote=\"#{ FIBER_LOGIN_URL }\">"
            $el = $(html).appendTo('body')
            @setElement($el)

            Util.render_template(@$el, 'login-template')

            super()

        handleSubmitSuccess: (response) ->
            window.location = '/'


    class SidebarView extends Backbone.View
        initialize: ->
            @setElement($('#df-wpr-sidebar'))

            new PageTreeView()
            new ContentTreeView()


    class PageTreeView extends Backbone.View
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
                { title: 'Edit', url: "#edit" },
                { title: 'Delete' }
            ]

            context_menu =
                position: position
                items: items

            ui_state.set('context_menu': context_menu)


    class ContentTreeView extends Backbone.View
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

        initialize: ->
            @model = ui_state

            super()

            $('html, body').bind(
                'click contextmenu',
                ->
                    ui_state.set('context_menu', null)
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


    $(->
        fiber_data = $('body').data('fiber-data')

        if fiber_data
            if fiber_data.show_login
                new LoginView().render()
            else
                new SidebarView()
                new ContextMenuView()
    )
)