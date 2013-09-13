define(['marionette', 'views/ToolbarView', 'models/Toolbar', 'collections/ToolbarButtons', 'views/FeedListView', 'domReady!'], 
	function (Marionette, ToolbarView, Toolbar, ToolbarButtons, FeedListView) {
		var toolbar = new Toolbar({ id: 'feeds' });
		var buttons = new ToolbarButtons();

		var feeds = new (Marionette.Layout.extend({
			template: '#template-region',
			tagName: 'section',
			className: 'region',
			initialize: function() {
				this.el.view = this;
				this.el.addEventListener('contextmenu', function(e) {
					e.preventDefault();
				});	
			},
			regions: {
				toolbar: '.toolbar',
				feedList: '.content'
			}
		}));

		feeds.on('show', function() {
			//this.toolbar.$el = $(this.toolbar.el);
			this.toolbar.show( new ToolbarView({ model: toolbar, collection: buttons }) );
			this.feedList.show( new FeedListView() );
		});

		window.feeds = feeds;
		

		return feeds;
	}
);