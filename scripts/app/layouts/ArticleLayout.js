define([
	'jquery', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/contentView', 'views/SandboxView',
	'views/OverlayView', 'views/LogView', 'domReady!'
],
function ($, Layout, ToolbarView, Toolbar, contentView, SandboxView, OverlayView, LogView) {

		var toolbar = new Toolbar({ id: 'article' });

		var ArticleLayout = Layout.extend({
			el: '#region-article',
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
				
			},
			handleMouseDown: function(e) {
				if (this.overlay.isVisible() && !e.target.matchesSelector('.overlay, .overlay *')) {
					this.overlay.hide();
				}
			}
			
		});

		return ArticleLayout;
	}
);