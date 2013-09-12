define(['marionette'], function (Marionette) {
	var app = new Marionette.Application();

	app.addRegions({
	   feeds: '#region-feeds',
	   articles: '#region-articles',
	   article: '#region-article'
	});


	app.addInitializer(function() {
		alert('app started');
	});
	
	return app;
});