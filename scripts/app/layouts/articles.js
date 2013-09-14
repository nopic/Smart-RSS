define([
	'marionette', 'views/ToolbarView', 'models/Toolbar', 'collections/ToolbarButtons', 'views/articleList', 
	'instances/contextMenus', 'domReady!'
], 
	function (Marionette, ToolbarView, Toolbar, ToolbarButtons, articleList, contextMenus) {
		var toolbar = new Toolbar({ id: 'articles' });
		var buttons = new ToolbarButtons();

		var articles = new (Marionette.Layout.extend({
			template: '#template-articles',
			tagName: 'section',
			className: 'region',
			events: {
				'keydown': 'handleKeyDown',
				'mousedown': 'handleMouseDown',
				'click #panel-toggle': 'handleClickToggle'
			},
			regions: {
				toolbar: '.toolbar',
				articleList: '.content'
			},
			initialize: function() {
				this.el.view = this;


				/****window.addEventListener('focus', function() {
					document.documentElement.classList.add('focused');
				});

				window.addEventListener('blur', function() {
					document.documentElement.classList.remove('focused');
				});****/
			}
			
		}));

		articles.on('show', function() {
			//this.toolbar.$el = $(this.toolbar.el);
			this.toolbar.show( new ToolbarView({ model: toolbar, collection: buttons }) );
			this.articleList.show( articleList.attach() );
		});
		

		return articles;
	}
);