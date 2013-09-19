/**
 * @module App
 * @submodule layouts/ArticlesLayout
 */
define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/articleList',
	'mixins/resizable', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, articleList, resizable) {

	var toolbar = new Toolbar({ id: 'articles' });

	/**
	 * Articles layout
	 * @class ArticlesLayout
	 * @constructor
	 * @extends Layout
	 */
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

			this.enableResizing(bg.settings.get('layout'));

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
		}
		
	});

	ArticlesLayout = ArticlesLayout.extend(resizable);

	return ArticlesLayout;
});