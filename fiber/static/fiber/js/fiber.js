var Util, fiber_jQuery, jQuery, runWithFiberJQuery,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

fiber_jQuery = $.noConflict(true);

jQuery = $;

/*
Run this function in the fiber jquery namespace.

 Usage: runWithFiberJQuery(
    ($) ->
        -- my code
)
*/


runWithFiberJQuery = function(f) {
  return f(fiber_jQuery);
};

Util = {};

runWithFiberJQuery(function($) {
  var ConditionalDisplayView, templates;
  templates = {};
  Util.get_template = function(template_id) {
    var template;
    template = templates[template_id];
    if (!template) {
      template = Handlebars.compile($("#" + template_id).html());
      templates[template_id] = template;
    }
    return template;
  };
  Util.render_template = function($el, template_id, context) {
    var html, template;
    template = Util.get_template(template_id);
    html = template(context);
    if ($el) {
      return $el.html(html);
    } else {
      return $(html);
    }
  };
  ConditionalDisplayView = (function(_super) {

    __extends(ConditionalDisplayView, _super);

    function ConditionalDisplayView() {
      return ConditionalDisplayView.__super__.constructor.apply(this, arguments);
    }

    ConditionalDisplayView.prototype.when = {};

    ConditionalDisplayView.prototype.initialize = function() {
      this.model.on('change', this.tryRender, this);
      return this.is_displayed = false;
    };

    ConditionalDisplayView.prototype.mustRender = function() {
      var key, value, _ref, _ref1;
      _ref = this.when;
      for (key in _ref) {
        value = _ref[key];
        if (_.str.endsWith(key, '__has_value')) {
          key = key.replace('__has_value', '');
          if ((_ref1 = this.model.get(key)) === null || _ref1 === (void 0)) {
            return false;
          }
        } else {
          if (this.model.get(key) !== value) {
            return false;
          }
        }
      }
      return true;
    };

    ConditionalDisplayView.prototype.tryRender = function() {
      if (!this.mustRender()) {
        return this.handleHide();
      } else {
        if (!this.is_rendered) {
          this.is_rendered = true;
          this.renderOnce();
        }
        this.show();
        return this.render();
      }
    };

    ConditionalDisplayView.prototype.renderOnce = function() {};

    ConditionalDisplayView.prototype.render = function() {};

    ConditionalDisplayView.prototype.reset = function() {
      return this.is_rendered = false;
    };

    ConditionalDisplayView.prototype.handleHide = function() {
      if (this.is_displayed) {
        this.is_displayed = false;
        return this.hide();
      }
    };

    ConditionalDisplayView.prototype.handleShow = function() {
      if (!this.is_displayed) {
        this.is_displayed = true;
        return this.show();
      }
    };

    ConditionalDisplayView.prototype.show = function() {
      if (this.$el) {
        return this.$el.show();
      }
    };

    ConditionalDisplayView.prototype.hide = function() {
      if (this.$el) {
        return this.$el.hide();
      }
    };

    return ConditionalDisplayView;

  })(Backbone.View);
  return Util.ConditionalDisplayView = ConditionalDisplayView;
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

runWithFiberJQuery(function($) {
  var ContentTreeView, ContextMenuView, LoginView, ModalView, PageTreeView, SidebarView, ui_state;
  ui_state = new Backbone.Model();
  ModalView = (function(_super) {

    __extends(ModalView, _super);

    function ModalView() {
      return ModalView.__super__.constructor.apply(this, arguments);
    }

    ModalView.prototype.events = {
      'click .submit': 'submit'
    };

    ModalView.prototype.render = function() {
      return this.$el.modal();
    };

    ModalView.prototype.getForm = function() {
      return this.$el.find('form');
    };

    ModalView.prototype.submit = function() {
      return this.getForm().ajaxSubmit({
        success: $.proxy(this.handleSubmitSuccess, this),
        error: $.proxy(this.handleSubmitError, this)
      });
    };

    ModalView.prototype.handleSubmitSuccess = function(response) {};

    ModalView.prototype.handleSubmitError = function(response) {
      return this.getForm().replaceWith(response.responseText);
    };

    return ModalView;

  })(Backbone.View);
  LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.render = function() {
      var $el, html;
      html = "<div id=\"login-form\" class=\"modal hide\" data-remote=\"" + FIBER_LOGIN_URL + "\">";
      $el = $(html).appendTo('body');
      this.setElement($el);
      Util.render_template(this.$el, 'login-template');
      return LoginView.__super__.render.call(this);
    };

    LoginView.prototype.handleSubmitSuccess = function(response) {
      return window.location = '/';
    };

    return LoginView;

  })(ModalView);
  SidebarView = (function(_super) {

    __extends(SidebarView, _super);

    function SidebarView() {
      return SidebarView.__super__.constructor.apply(this, arguments);
    }

    SidebarView.prototype.initialize = function() {
      this.setElement($('#df-wpr-sidebar'));
      new PageTreeView();
      return new ContentTreeView();
    };

    return SidebarView;

  })(Backbone.View);
  PageTreeView = (function(_super) {

    __extends(PageTreeView, _super);

    function PageTreeView() {
      return PageTreeView.__super__.constructor.apply(this, arguments);
    }

    PageTreeView.prototype.initialize = function() {
      this.setElement($('#df-sidebar-page-tree'));
      this.page_data = window.fiber_page_data;
      return this.render();
    };

    PageTreeView.prototype.render = function() {
      this.$el.tree({
        data: this.page_data,
        autoOpen: 0,
        saveState: 'fiber_pages',
        dragAndDrop: true,
        selectable: true,
        onCreateLi: $.proxy(this.createLi, this)
      });
      return this.$el.bind('tree.contextmenu', $.proxy(this.handleContextMenu, this));
    };

    PageTreeView.prototype.createLi = function(node, $li) {
      var $div;
      if (node.change_url) {
        $div = $li.find('div');
        $li.find('.jqtree-title').before('<span class="icon"></span>');
        $div.addClass('page');
        if (!node.show_in_menu) {
          $div.addClass('hidden-in-menu');
        }
        if (!node.is_public) {
          $div.addClass('non-public');
        }
        if (node.is_redirect) {
          $div.addClass('redirect');
        }
        if (!node.editable) {
          return $div.addClass('non-editable');
        }
      }
    };

    PageTreeView.prototype.handleContextMenu = function(e) {
      var context_menu, items, node, position;
      node = e.node;
      if (!node.editable) {
        return;
      }
      position = {
        left: e.click_event.pageX,
        top: e.click_event.pageY
      };
      items = [
        {
          title: 'Edit',
          url: "#edit"
        }, {
          title: 'Delete'
        }
      ];
      context_menu = {
        position: position,
        items: items
      };
      return ui_state.set({
        'context_menu': context_menu
      });
    };

    return PageTreeView;

  })(Backbone.View);
  ContentTreeView = (function(_super) {

    __extends(ContentTreeView, _super);

    function ContentTreeView() {
      return ContentTreeView.__super__.constructor.apply(this, arguments);
    }

    ContentTreeView.prototype.initialize = function() {
      this.setElement($('#df-sidebar-content-tree'));
      this.content_data = window.fiber_content_items_data;
      return this.render();
    };

    ContentTreeView.prototype.render = function() {
      return this.$el.tree({
        data: this.content_data,
        saveState: 'fiber_content_items'
      });
    };

    return ContentTreeView;

  })(Backbone.View);
  ContextMenuView = (function(_super) {

    __extends(ContextMenuView, _super);

    function ContextMenuView() {
      return ContextMenuView.__super__.constructor.apply(this, arguments);
    }

    ContextMenuView.prototype.when = {
      context_menu__has_value: true
    };

    ContextMenuView.prototype.events = {
      'click a': 'handleClick'
    };

    ContextMenuView.prototype.initialize = function() {
      this.model = ui_state;
      ContextMenuView.__super__.initialize.call(this);
      return $('html, body').bind('click contextmenu', function() {
        return ui_state.set('context_menu', null);
      });
    };

    ContextMenuView.prototype.render = function() {
      var $el, context_menu;
      this.remove();
      context_menu = this.model.get('context_menu');
      $el = Util.render_template(null, 'contextmenu-template', {
        items: context_menu.items
      });
      $(document.body).append($el);
      $el.offset(context_menu.position);
      return this.setElement($el);
    };

    ContextMenuView.prototype.handleClick = function(e) {
      var $target, url;
      this.remove();
      $target = $(e.target);
      url = $target.attr('href');
      if (url) {
        Backbone.history.navigate(url, {
          trigger: true
        });
      }
      return false;
    };

    ContextMenuView.prototype.hide = function() {
      return this.remove();
    };

    ContextMenuView.prototype.remove = function() {
      if (this.$el) {
        this.$el.remove();
      }
      return this.$el = null;
    };

    return ContextMenuView;

  })(Util.ConditionalDisplayView);
  return $(function() {
    var fiber_data;
    fiber_data = $('body').data('fiber-data');
    if (fiber_data) {
      if (fiber_data.show_login) {
        return new LoginView().render();
      } else {
        new SidebarView();
        return new ContextMenuView();
      }
    }
  });
});
