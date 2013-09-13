define([
	'marionette', 'views/ToolbarView', 'models/Toolbar', 'collections/ToolbarButtons', 'views/FeedListView', 
	'instances/contextMenus', 'views/Properties', 'domReady!'
], 
	function (Marionette, ToolbarView, Toolbar, ToolbarButtons, FeedListView, contextMenus, Properties) {
		var toolbar = new Toolbar({ id: 'feeds' });
		var buttons = new ToolbarButtons();

		var feeds = new (Marionette.Layout.extend({
			template: '#template-feeds',
			tagName: 'section',
			className: 'region',
			events: {
				'keydown': 'handleKeyDown',
				'mousedown': 'handleMouseDown',
				'click #panel-toggle': 'handleClickToggle'
			},
			regions: {
				toolbar: '.toolbar',
				properties: '#properties',
				feedList: '.content'
			},
			initialize: function() {

				this.el.view = this;
				window.addEventListener('focus', function() {
					document.documentElement.classList.add('focused');
				});

				window.addEventListener('blur', function() {
					document.documentElement.classList.remove('focused');
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
					var wid = $(window).width();
					/****bg.settings.save({ posA: wid + ',*' });****/
				}
			},
			handleMouseDown: function(e) {
				if (contextMenus.areActive() && !e.target.matchesSelector('.context-menu, .context-menu *')) {
					// make sure the action gets executed
					contextMenus.hideAll();
				}
			},
			handleKeyDown: function(e) {
				if (document.activeElement && document.activeElement.tagName == 'INPUT') {
					return;
				}

				if (e.keyCode == 68) {
					//there shouldn't be the same shortcut for deleting item and source
					//list.selectedItems.forEach(list.removeSource, list);
				} else if (e.keyCode == 50 && e.shiftKey) {
					window.top.frames[1].focus();
					e.preventDefault();
				} else if (e.keyCode == 51 && e.shiftKey) {
					window.top.frames[2].focus();
					e.preventDefault();
				} else if (e.keyCode == 38) {
					var cs = $('.selected:first');
					var s;
					if (cs.length) {
						s = cs.prevAll('.list-item:not(.in-closed-folder):first').get(0);
					} else {
						s = $('.list-item:not(.in-closed-folder):last').get(0);
					}
					if (s) s.view.select();
					e.preventDefault();
				} else if (e.keyCode == 40) {
					var cs = $('.selected:first');
					var s;
					if (cs.length) {
						s = cs.nextAll('.list-item:not(.in-closed-folder):first').get(0);
					} else {
						s = $('.list-item:not(.in-closed-folder):first').get(0);
					}
					if (s) s.view.select();
					e.preventDefault();
				} else if (e.keyCode == 37 && e.ctrlKey) {
					var folders = $('.folder.opened');
					if (!folders.length) return;
					folders.each(function(i, folder) {
						if (folder.view) {
							folder.view.handleClickArrow(e);
						}
					});
				} else if (e.keyCode == 39 && e.ctrlKey) {
					var folders = $('.folder:not(.opened)');
					if (!folders.length) return;
					folders.each(function(i, folder) {
						if (folder.view) {
							folder.view.handleClickArrow(e);
						}
					});
				} else if (e.keyCode == 37) {
					var cs = $('.selected:first');
					if (cs.length && cs.hasClass('folder')) {
						cs.get(0).view.handleClickArrow(e);
					}
					e.preventDefault();
				} else if (e.keyCode == 39) {
					var cs = $('.selected:first');
					if (cs.length) {
						cs.get(0).view.showSourceItems({ noSelect: true, shiftKey: e.shiftKey, noFocus: true });
					}
					e.preventDefault();
				} else if (e.keyCode == 13) {
					var cs = $('.selected:first');
					if (cs.length) {
						cs.get(0).view.showSourceItems({ noSelect: true, shiftKey: e.shiftKey });
					}
					e.preventDefault();
				} else if (e.keyCode == 27) {
					if (sourcesContextMenu.el.parentNode) {
						// make sure the action gets executed
						contextMenus.hideAll();
						//sourcesContextMenu.hide();
					}
				}
			},
			handleLoadingChange: function(e) {
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
		}));

		feeds.on('show', function() {
			//this.toolbar.$el = $(this.toolbar.el);
			this.toolbar.show( new ToolbarView({ model: toolbar, collection: buttons }) );
			this.properties.show( new Properties() );;
			this.feedList.show( new FeedListView() );
		});

		window.feeds = feeds;
		

		return feeds;
	}
);