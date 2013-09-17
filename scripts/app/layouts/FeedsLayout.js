define([
	'jquery', 'underscore', 'layouts/Layout', 'views/ToolbarView', 'models/Toolbar', 'views/feedList',
	'instances/contextMenus', 'views/properties', 'domReady!'
],
function ($, _, Layout, ToolbarView, Toolbar, feedList, contextMenus, Properties) {

		var toolbar = new Toolbar({ id: 'feeds' });

		var FeedsLayout = Layout.extend({
			template: _.template($('#template-feeds').html()),
			el: '#region-feeds',
			events: {
				'mousedown': 'handleMouseDown',
				'click #panel-toggle': 'handleClickToggle'
			},
			initialize: function() {

				this.on('attached', function() {
					this.attach('toolbar', new ToolbarView({ model: toolbar }) );
					this.attach('properties', new Properties );
					this.attach('feedList', feedList );
				});

				this.el.view = this;

				this.$el.on('focus', function() {
					$(this).addClass('focused');
				});

				this.$el.on('blur', function() {
					$(this).removeClass('focused');
				});


				bg.loader.on('change:loading', this.handleLoadingChange, this);
				bg.loader.on('change:loaded', this.renderIndicator, this);
				bg.loader.on('change:maxSources', this.renderIndicator, this);
				bg.settings.on('change:panelToggled', this.handleToggleChange, this);
				bg.sources.on('clear-events', this.handleClearEvents, this);
				this.handleLoadingChange();
				this.handleToggleChange();
				if (bg.settings.get('enablePanelToggle')) {
					$('#panel-toggle').css('display', 'block');
				}

				window.addEventListener('resize', this.handleResize.bind(this));
			},
			handleClearEvents: function(id) {
				if (window == null || id == window.top.tabID) {
					bg.loader.off('change:loading', this.handleLoadingChange, this);
					bg.loader.off('change:loaded', this.renderIndicator, this);
					bg.loader.off('change:maxSources', this.renderIndicator, this);
					bg.settings.off('change:panelToggled', this.handleToggleChange, this);
					bg.sources.off('clear-events', this.handleClearEvents, this);
				}
			},
			handleClickToggle: function() {
				bg.settings.save('panelToggled', !bg.settings.get('panelToggled'));
			},
			handleToggleChange: function() {
				$('#panel').toggleClass('hidden', !bg.settings.get('panelToggled'));
				$('#panel-toggle').toggleClass('toggled', bg.settings.get('panelToggled'));
			},
			handleResize: function() {
				if (bg.settings.get('panelToggled')) {
					var wid = this.el.offsetWidth;
					bg.settings.save({ posA: wid + ',*' });
				}
			},
			handleMouseDown: function(e) {
				if (contextMenus.areActive() && !e.target.matchesSelector('.context-menu, .context-menu *')) {
					// make sure the action gets executed
					contextMenus.hideAll();
				}
			},
			handleLoadingChange: function() {
				if (bg.loader.get('loading') == true) {
					this.renderIndicator();
					$('#indicator').css('display', 'block');
				} else {
					setTimeout(function() {
						$('#indicator').css('display', 'none');
					}, 500);
				}
			},
			renderIndicator: function() {
				var l = bg.loader;
				if (l.get('maxSources') == 0) return;
				var perc = Math.round(l.get('loaded') * 100 / l.get('maxSources'));
				$('#indicator').css('background', 'linear-gradient(to right,  #c5c5c5 ' + perc + '%, #eee ' + perc + '%)');
				$('#indicator').html(bg.lang.c.UPDATING_FEEDS + ' (' + l.get('loaded') + '/' + l.get('maxSources') + ')');
			}
		});

		return FeedsLayout;
	}
);