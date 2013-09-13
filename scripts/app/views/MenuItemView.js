define(['backbone'], function(BB) {
	var MenuItemView = Backbone.View.extend({
		tagName: 'div',
		className: 'context-menu-item',
		contextMenu: null,
		events: {
			'click': 'handleClick'
		},
		initialize: function() {
			if (this.model.id) {
				this.el.id = this.model.id;
			}
		},
		render: function() {
			if (this.model.get('icon')) {
				this.$el.css('background', 'url(/images/' + this.model.get('icon') + ') no-repeat left center');
			}
			this.$el.html(this.model.get('title'));
			return this;
		},
		handleClick: function(e) {
			var action = this.model.get('action');
			if (action && typeof action == 'function') {
				action(e, app.feeds.currentView.feedList.currentView);
				this.contextMenu.hide();
			}
		}
	});

	return MenuItemView;
});