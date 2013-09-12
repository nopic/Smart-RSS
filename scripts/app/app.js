define(['marionette', 'domReady!', 'collections/Actions', 'layouts/feeds'], function (Marionette, doc, Actions, feeds) {
	var app = new Marionette.Application();

	app.addRegions({
		feeds: '#region-feeds',
		articles: '#region-articles',
		article: '#region-article'
	});

	app.actions = new Actions();

	app.feeds.show(feeds);

	app.on('start', function() {
		alert('app started');
	});

	return app;
});