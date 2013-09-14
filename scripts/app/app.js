define(['marionette', 'domReady!', 'collections/Actions', 'layouts/feeds', 'layouts/articles', 'preps/all'], 
function (Marionette, doc, Actions, feeds, articles) {

	//$('body').html( bg.translate($('body').html()) );
	document.documentElement.style.fontSize = bg.settings.get('uiFontSize') + '%';

	var templates = $('script[type="text/template"]');
	templates.each(function(i, el) {
		el.innerHTML = bg.translate(el.innerHTML);
	});

	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();
	});	

	var app = window.app = new Marionette.Application({
		fixURL: function(url) {
			if (url.search(/[a-z]+:\/\//) == -1) {
				url = 'http://' + url;
			}
			return url;
		}
	});

	app.actions = new Actions();

	app.addRegions({
		feeds: '#region-feeds',
		articles: '#region-articles',
		article: '#region-article'
	});

	app.feeds.show(feeds);
	app.articles.show(articles);

	app.on('start', function() {
		console.log('app started');
	});

	return app;
});	