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
				'mousedown': 'handleMouseDown'
			},
			regions: {
				toolbar: '.toolbar',
				articleList: '.content'
			},
			initialize: function() {
				this.el.view = this;


				/****
				window.addEventListener('resize', this.handleResize.bind(this));
				window.addEventListener('focus', function() {
					document.documentElement.classList.add('focused');
				});

				window.addEventListener('blur', function() {
					document.documentElement.classList.remove('focused');
				});****/
			},
			handleResize: function() {
				if (bg.settings.get('layout') == 'horizontal') {
					var wid = $(window).width();
					bg.settings.save({ posB: wid + ',*' });
				} else {
					var hei = $(window).height();
					bg.settings.save({ posC: hei + ',*' });
				}
			},
			handleMouseDown: function(e) {
				if (contextMenus.get('items').el.parentNode && !e.target.matchesSelector('.context-menu, .context-menu *')) {
					// make sure the action gets executed
					contextMenus.get('items').hide();
				}
			}
			
		}));

		articles.on('show', function() {
			//this.toolbar.$el = $(this.toolbar.el);
			this.toolbar.show( new ToolbarView({ model: toolbar, collection: buttons }) );
			this.articleList.show( articleList.attach() );
			/****$('#input-search').attr('placeholder', bg.lang.c.SEARCH);****/
		});
		

		return articles;
	}
);