define(['marionette', 'domReady!', 'collections/Actions', 'layouts/feeds', 'preps/all'], function (Marionette, doc, Actions, feeds) {
	var app = window.app = new Marionette.Application();

	app.actions = new Actions();

	app.addRegions({
		feeds: '#region-feeds',
		articles: '#region-articles',
		article: '#region-article'
	});

	app.feeds.show(feeds);

	app.on('start', function() {
		console.log('app started');
	});

	return app;
});	