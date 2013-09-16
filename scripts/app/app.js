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
		str += String.fromCharCode(e.keyCode).toLowerCase();

		if (app.focus) {
			if (str in shortcuts[app.focus]) {
				app.actions.execute( shortcuts[app.focus][str], e);
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