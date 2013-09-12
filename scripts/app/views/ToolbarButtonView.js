define(['marionette', 'domReady!'], function (Marionette) {
	var ToolbarButtonView = Marionette.ItemView.extend({
		tagName: 'div',
		className: 'button',
		template: '#template-empty',
		initialize: function() {
			this.el.view = this;
		},
		onRender: function() {
			
		}
	});

	return ToolbarButtonView;
});