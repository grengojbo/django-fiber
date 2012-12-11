# Create our own jquery namespace
fiber_jQuery = $.noConflict(true)

jQuery = $  # Some plugins use jQuery() instead of $()

###
Run this function in the fiber jquery namespace.

 Usage: runWithFiberJQuery(
    ($) ->
        -- my code
)
###
runWithFiberJQuery = (f) ->
    f(fiber_jQuery)


# Util namespace
Util = {}


runWithFiberJQuery(($) ->
    templates = {}

    Util.get_template = (template_id) ->
        template = templates[template_id]

        if not template
            template = Handlebars.compile($("##{ template_id }").html())
            templates[template_id] = template

        return template


    Util.render_template = ($el, template_id, context) ->
        template = Util.get_template(template_id)

        html = template(context)

        if $el
            return $el.html(html)
        else
            return $(html)


    class ConditionalDisplayView extends Backbone.View
        when: {}

        initialize: ->
            if @model
                @model.on('change', @tryRender, this)

            @is_displayed = false

        mustRender: ->
            for key, value of @when
                if _.str.endsWith(key, '__has_value')
                    key = key.replace('__has_value', '')
                    if @model.get(key) in [null, undefined]
                        return false
                else
                    if @model.get(key) != value
                        return false

            return true

        tryRender: ->
            if not @mustRender()
                @handleHide()
            else
                if not @is_rendered
                    @is_rendered = true
                    @renderOnce()

                @handleShow()
                @render()

        renderOnce: ->
            # 'renderOnce' is called on first render (before 'render')

        render: ->
            # 'render' is called on each render

        reset: ->
            @is_rendered = false

        handleHide: ->
            if @is_displayed
                @is_displayed = false
                @hide()

        handleShow: ->
            if not @is_displayed
                @is_displayed = true
                @show()

        show: ->
            if @$el
                @$el.show()

        hide: ->
            if @$el
                @$el.hide()

    Util.ConditionalDisplayView = ConditionalDisplayView


    class ModalFormView extends ConditionalDisplayView
        events:
            'click .submit': 'submit'
            'click .close': 'close'
            'click .cancel': 'close'

        show: ->
            @$el.modal()

        hide: ->
            @$el.modal('hide')

        renderOnce: ->
            html = "<div id=\"#{ @id }\" class=\"modal hide\"></div>"
            $el = $(html).appendTo('body')
            @setElement($el)

            Util.render_template(
                @$el,
                'modal-template',
                    title: @title
                    submit_title: @submit_title
            )

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

        close: ->
            @hide()

    Util.ModalFormView = ModalFormView
)