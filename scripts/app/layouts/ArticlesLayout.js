define([
	'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/articleList', 
	'instances/contextMenus', 'domReady!'
], 
	function (Layout, ToolbarView, Toolbar, articleList, contextMenus) {
		var toolbar = new Toolbar({ id: 'articles' });

		var ArticlesLayout = Layout.extend({
			template: _.template($('#template-articles').html()),
			el: '#region-articles',
			events: {
				'keydown': 'handleKeyDown',
				'mousedown': 'handleMouseDown'
			},
			initialize: function() {
				this.el.view = this;

				this.on('attached', function() {
					/****$('#input-search').attr('placeholder', bg.lang.c.SEARCH);****/
					this.attach('toolbar', new ToolbarView({ model: toolbar }) );
					this.attach('articleList', articleList );
				});


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
			
		});

		return ArticlesLayout;
	}
);