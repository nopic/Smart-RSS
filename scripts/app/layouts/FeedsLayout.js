/**
 * @module App
 * @submodule layouts/FeedsLayout
 */
define([
	'jquery', 'underscore', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/feedList',
	'instances/contextMenus', 'views/properties', 'mixins/resizable', 'views/IndicatorView', 'domReady!'
],
function ($, _, Layout, ToolbarView, Toolbar, feedList, contextMenus, Properties, resizable, IndicatorView) {

	var toolbar = new Toolbar({ id: 'feeds' });

	/**
	 * Left column layout
	 * @class FeedsLayout
	 * @constructor
	 * @extends Layout
	 */
	var FeedsLayout = Layout.extend({
		/**
		 * Underscore template
		 * @property template
		 * @type Object
		 */
		template: _.template($('#template-feeds').html()),

		/**
		 * View element
		 * @property el
		 * @default #region-feeds
		 * @type HTMLElement
		 */
		el: '#region-feeds',

		events: {
			'mousedown': 'handleMouseDown',
			'click #panel-toggle': 'handleClickToggle'
		},

		/**
		 * @method initialize
		 */
		initialize: function() {

			this.on('attached', function() {
				this.attach('toolbar', new ToolbarView({ model: toolbar }) );
				this.attach('properties', new Properties);
				this.attach('feedList', feedList);
				this.attach('feedList', new IndicatorView);
			});

			this.el.view = this;

			this.$el.on('focus', function() {
				$(this).addClass('focused');
			});

			this.$el.on('blur', function() {
				$(this).removeClass('focused');
			});

			bg.settings.on('change:panelToggled', this.handleToggleChange, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);
			this.handleToggleChange();
			if (bg.settings.get('enablePanelToggle')) {
				$('#panel-toggle').css('display', 'block');
			}

			window.addEventListener('resize', this.handleResize.bind(this));

			this.enableResizing();
		},

		/**
		 * Clears events when tab is closed
		 * @method handleClearEvents
		 * @param id {Integer} ID of the closed tab
		 */
		handleClearEvents: function(id) {
			if (window == null || id == window.top.tabID) {
				bg.settings.off('change:panelToggled', this.handleToggleChange, this);
				bg.sources.off('clear-events', this.handleClearEvents, this);
			}
		},

		/**
		 * Saves the panel toggle state (panel visible/hidden)
		 * @method handleClickToggle
		 */
		handleClickToggle: function() {
			bg.settings.save('panelToggled', !bg.settings.get('panelToggled'));
		},

		/**
		 * Shows/hides the panel
		 * @method handleToggleChange
		 */
		handleToggleChange: function() {
			$('#panel').toggleClass('hidden', !bg.settings.get('panelToggled'));
			$('#panel-toggle').toggleClass('toggled', bg.settings.get('panelToggled'));
		},

		/**
		 * Saves layout size
		 * @method handleResize
		 */
		handleResize: function() {
			if (bg.settings.get('panelToggled')) {
				var wid = this.el.offsetWidth;
				bg.settings.save({ posA: wid + ',*' });
			}
		}
	});

	FeedsLayout = FeedsLayout.extend(resizable);

	return FeedsLayout;
});