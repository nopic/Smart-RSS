define(['marionette', 'domReady!'], function (Marionette) {
	var ToolbarButtonView = Marionette.ItemView.extend({
		tagName: 'div',
		className: 'button',
		template: '#template-empty',
		initialize: function() {
			this.el.view = this;
			var action = app.actions.get(this.model.get('actionName'));
			this.$el.css('background', 'url("/images/' + action.get('icon') + '") no-repeat center center');
			this.el.title = action.get('title');
		},
		onRender: function() {
			
		}
	});

	return ToolbarButtonView;
});