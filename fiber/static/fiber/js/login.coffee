runWithFiberJQuery(($) ->
    class LoginView extends Util.ModalFormView
        constructor: (options) ->
            @login_url = options.login_url

            super(options)

        render: ->
            html = "<div id=\"login-form\" class=\"modal hide\" data-remote=\"#{ @login_url }\">"
            $el = $(html).appendTo('body')
            @setElement($el)

            Util.render_template(@$el, 'login-template')

            super()

        handleSubmitSuccess: (response) ->
            window.location = '/'    


    Fiber.display_login = (login_url) ->
        new LoginView(login_url: login_url).render()
)