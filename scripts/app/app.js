define([
	'layouts/Layout', 'jquery', 'domReady!', 'collections/Actions', 'layouts/FeedsLayout', 'layouts/ArticlesLayout',
	'layouts/ArticleLayout', 'staticdb/shortcuts', 'preps/all'
],
function (Layout, $, doc, Actions, FeedsLayout, ArticlesLayout, ArticleLayout, shortcuts) {

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
		focusLayout: function(e) {
			this.setFocus(e.currentTarget.getAttribute('name'));
		},
		start: function() {
			this.attach('feeds', new FeedsLayout);
			this.attach('articles', new ArticlesLayout);
			this.attach('article', new ArticleLayout);

			this.setFocus('articles');

			this.trigger('start');
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




	app.actions = new Actions();


	return app;
});