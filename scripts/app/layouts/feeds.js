define(['marionette', 'views/ToolbarView', 'models/Toolbar', 'collections/ToolbarButtons', 'domReady!'], 
	function (Marionette, ToolbarView, Toolbar, ToolbarButtons) {
		var toolbar = new Toolbar({ id: 'feeds' });
		var buttons = new ToolbarButtons();

		var feeds = new (Marionette.Layout.extend({
			template: '#template-region',
			/*tagName: 'div',
			className: 'button',*/
			initialize: function() {
				this.el.view = this;
			},
			regions: {
				toolbar: '.toolbar'
			}
		}));

		feeds.toolbar.show( new ToolbarView({ model: toolbar, collection: buttons }) );

		return feeds;
	}
);