/**
 * @module App
 * @submodule layouts/FeedsLayout
 */
define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/feedList',
	'instances/contextMenus', 'views/properties', 'mixins/resizable', 'views/IndicatorView', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, feedList, contextMenus, Properties, resizable, IndicatorView) {

	var toolbar = new Toolbar({ id: 'feeds' });

	/**
	 * Feeds layout view
	 * @class FeedsLayout
	 * @constructor
	 * @extends Layout
	 */
	var FeedsLayout = Layout.extend({
		/**
		 * View element
		 * @property el
		 * @default #region-feeds
		 * @type HTMLElement
		 */
		el: '#region-feeds',

		/**
		 * @method initialize
		 */
		initialize: function() {

			this.on('attach', function() {
				this.attach('toolbar', new ToolbarView({ model: toolbar }) );
				this.attach('properties', new Properties);
				this.attach('feedList', feedList);
				this.attach('indicator', new IndicatorView);
			});

			this.el.view = this;

			this.$el.on('focus', function() {
				$(this).addClass('focused');
			});

			this.$el.on('blur', function() {
				$(this).removeClass('focused');
			});

			this.on('resize:after', this.handleResize);
			//window.addEventListener('resize', this.handleResize.bind(this));

			this.enableResizing('horizontal', bg.settings.get('posA'));
		},

		/**
		 * Saves layout size
		 * @method handleResize
		 */
		handleResize: function() {
			if (bg.settings.get('panelToggled')) {
				var wid = this.el.offsetWidth;
				bg.settings.save({ posA: wid });
			}
		}
	});

	FeedsLayout = FeedsLayout.extend(resizable);

	return FeedsLayout;
});