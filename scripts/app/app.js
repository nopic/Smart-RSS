/**
 * @module App
 */
define([
	'layouts/Layout', 'jquery', 'domReady!', 'collections/Actions', 'layouts/FeedsLayout', 'layouts/ArticlesLayout',
	'layouts/ContentLayout', 'staticdb/shortcuts', 'instances/contextMenus', 'preps/all'
],
function (Layout, $, doc, Actions, FeedsLayout, ArticlesLayout, ContentLayout, shortcuts, contextMenus) {

	//$('body').html( bg.translate($('body').html()) );
	document.documentElement.style.fontSize = bg.settings.get('uiFontSize') + '%';

	var templates = $('script[type="text/template"]');
	templates.each(function(i, el) {
		el.innerHTML = bg.translate(el.innerHTML);
	});

	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();
	});

	var app = window.app = new (Layout.extend({
		el: 'body',
		fixURL: function(url) {
			if (url.search(/[a-z]+:\/\//) == -1) {
				url = 'http://' + url;
			}
			return url;
		},
		events: {
			'mousedown': 'handleMouseDown'
		},
		initialize: function() {
			this.actions = new Actions();
			window.addEventListener('blur', this.hideContextMenus.bind(this));
		},
		handleMouseDown: function(e) {
			if (!e.target.matchesSelector('.context-menu, .context-menu *')) {
				this.hideContextMenus();
			}
		},
		hideContextMenus: function() {
			if (contextMenus.areActive()) {
				// make sure the action gets executed
				contextMenus.hideAll();
			}
		},
		focusLayout: function(e) {
			this.setFocus(e.currentTarget.getAttribute('name'));
		},
		start: function() {
			this.attach('feeds', new FeedsLayout);
			this.attach('articles', new ArticlesLayout);
			this.attach('content', new ContentLayout);

			this.setFocus('articles');

			if (bg.settings.get('layout')) {
				$('.regions .regions').addClass('vertical');
			}

			this.trigger('start');

			setTimeout(function() {
				$('body').removeClass('loading');
			}, 0);
		}
	}));





	document.addEventListener('keydown', function(e) {
		if (document.activeElement && document.activeElement.tagName == 'INPUT') {
			return;
		}

		var str = '';
		if (e.ctrlKey) str += 'ctrl+';
		if (e.shiftKey) str += 'shift+';

		if (e.keyCode > 46 && e.keyCode < 91) {
			str += String.fromCharCode(e.keyCode).toLowerCase();
		} else if (e.keyCode in shortcuts.keys) {
			str += shortcuts.keys[e.keyCode];
		} else {
			return;
		}

		var focus = document.activeElement.getAttribute('name');

		if (focus) {
			if (str in shortcuts[focus]) {
				app.actions.execute( shortcuts[focus][str], e);
				e.preventDefault();
				return;
			}
		}

		if (str in shortcuts.global) {
			app.actions.execute( shortcuts.global[str], e);
			e.preventDefault();
		}
		
	});


	return app;
});