define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/articleList',
	'instances/contextMenus', 'mixins/resizable', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, articleList, contextMenus, resizable) {

		var toolbar = new Toolbar({ id: 'articles' });

		var ArticlesLayout = Layout.extend({
			el: '#region-articles',
			events: {
				'keydown': 'handleKeyDown',
				'mousedown': 'handleMouseDown'
			},
			initialize: function() {
				this.el.view = this;

				this.on('attached', function() {
					this.attach('toolbar', new ToolbarView({ model: toolbar }) );
					this.attach('articleList', articleList );
				});

				this.$el.on('focus', function() {
					$(this).addClass('focused');
				});

				this.$el.on('blur', function() {
					$(this).removeClass('focused');
				});

				this.enableResizing();

				/****
				window.addEventListener('resize', this.handleResize.bind(this));
				****/
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

		ArticlesLayout = ArticlesLayout.extend(resizable);

		return ArticlesLayout;
	}
);