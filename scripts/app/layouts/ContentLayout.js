/**
 * @module App
 * @submodule layouts/ContentLayout
 */
define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/contentView', 'views/SandboxView',
	'views/OverlayView', 'views/LogView', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, contentView, SandboxView, OverlayView, LogView) {

	var toolbar = new Toolbar({ id: 'article' });

	/**
	 * Content layout view
	 * @class ContentLayout
	 * @constructor
	 * @extends Layout
	 */
	var ContentLayout = Layout.extend({
		el: '#region-content',
		events: {
			'mousedown': 'handleMouseDown'
		},
		initialize: function() {
			this.on('attached', function() {

				this.attach('toolbar', new ToolbarView({ model: toolbar }) );
				this.attach('content', contentView );
				this.attach('sandbox', new SandboxView() );
				this.attach('log', new LogView() );
				this.attach('overlay', new OverlayView() );
			});

			this.$el.on('focus', function() {
				$(this).addClass('focused');
			});

			this.$el.on('blur', function() {
				$(this).removeClass('focused');
			});
			
		},
		handleMouseDown: function(e) {
			if (this.overlay.isVisible() && !e.target.matchesSelector('.overlay, .overlay *')) {
				this.overlay.hide();
			}
		}
		
	});

	return ContentLayout;
});