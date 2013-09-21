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
	 * Articles layout view
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

			this.on('resize:after', this.handleResize);

		},
		handleResize: function() {
			if (bg.settings.get('layout') == 'horizontal') {
				var wid = this.el.offsetWidth;
				bg.settings.save({ posB: wid });
			} else {
				var hei = this.el.offsetHeight;
				bg.settings.save({ posC:hei });
			}
		}
		
	});

	ArticlesLayout = ArticlesLayout.extend(resizable);

	return ArticlesLayout;
});