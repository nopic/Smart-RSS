window.addEventListener('focus', function() {
	document.documentElement.classList.add('focused');
});

window.addEventListener('blur', function() {
	document.documentElement.classList.remove('focused');
});

function fixURL(url) {
	if (url.search(/[a-z]+:\/\//) == -1) {
		url = 'http://' + url;
	}
	return url;
}

chrome.runtime.getBackgroundPage(function(bg) {

$(function() {

	$('body').html( bg.translate($('body').html()) );
	document.documentElement.style.fontSize = bg.settings.get('uiFontSize') + '%';

	

	

	var AppToolbar = Backbone.View.extend({
		el: '#toolbar',
		events: {
			'click #button-add': 'addSourceDialog',
			'click #button-add-folder': 'addFolderDialog',
			'click #button-reload': 'reloadSources'
		},
		initialize: function() {
			
		},
		addFolderDialog: function() {
			var title = (prompt(bg.lang.c.FOLDER_NAME + ': ') || '').trim();
			if (!title) return;

			bg.folders.create({
				title: title
			}, { wait: true });

		},
		addSourceDialog: function() {
			var url = (prompt(bg.lang.c.RSS_FEED_URL) || '').trim();
			if (!url)  return;

			var folderID = 0;
			if (list.selectedItems.length && list.selectedItems[0] instanceof FolderView) {
				var fid = list.selectedItems[0].model.get('id');
				// make sure source is not added to folder which is not in db
				if (bg.folders.get(fid)) {
					folderID = fid;	
				}
			}

			url = fixURL(url);
			bg.sources.create({
				title: url,
				url: url,
				updateEvery: 180,
				folderID: folderID
			}, { wait: true });

		
		},
		reloadSources: function() {
			bg.downloadAll(true);
		}
	});


	
	

	


	var properties = new (Backbone.View.extend({
		el: '#properties',
		currentSource: null,
		events: {
			'click button' : 'handleClick',
			'keydown button' : 'handleKeyDown',
			'click #advanced-switch' : 'handleSwitchClick',
		},
		initialize: function() {
			
		},
		handleClick: function(e) {
			var t = e.currentTarget;
			if (t.id == 'prop-cancel') {
				this.hide();
			} else if (t.id == 'prop-ok') {
				this.saveData();
			}
		},
		saveData: function() {
			if (!this.currentSource) {
				this.hide();
				return;
			}

			this.currentSource.save({
				title: $('#prop-title').val(),
				url: fixURL($('#prop-url').val()),
				username: $('#prop-username').val(),
				password: $('#prop-password').val(),
				updateEvery: parseFloat($('#prop-update-every').val())
			});

			this.hide();

		},
		handleKeyDown: function(e) {
			if (e.keyCode == 13) {
				this.handleClick(e);
			} 
		},
		show: function(source) {
			$('#prop-title').val(source.get('title'));;
			$('#prop-url').val(source.get('url'));
			$('#prop-username').val(source.get('username'));
			$('#prop-password').val(source.get('password'));
			if (source.get('updateEvery')) {
				$('#prop-update-every').val(source.get('updateEvery'));	
			}
			
			properties.$el.css('display', 'block');
		},
		hide: function() {
			properties.$el.css('display', 'none');
		},
		handleSwitchClick: function() {
			$('#properties-advanced').toggleClass('visible');
			$('#advanced-switch').toggleClass('switched');
		}
	}));


	var App = Backbone.View.extend({
		el: 'body',
		events: {
			'keydown': 'handleKeyDown',
			'mousedown': 'handleMouseDown',
			'click #panel-toggle': 'handleClickToggle'
		},
		initialize: function() {
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
				bg.settings.save({ posA: wid + ',*' });
			}
		},
		handleMouseDown: function(e) {
			if (sourcesContextMenu.el.parentNode && !e.target.matchesSelector('.context-menu, .context-menu *')) {
				// make sure the action gets executed
				contextMenus.hideAll();
				//sourcesContextMenu.hide();
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
	});

	var app, list, toolbar;

	bg.appStarted.always(function() {
		list = new AppList();
		toolbar = new AppToolbar();
		app = new App();
	});

});

});