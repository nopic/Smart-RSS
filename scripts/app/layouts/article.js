define([
	'marionette',  'views/ToolbarView', 'models/Toolbar', 'collections/ToolbarButtons', 'views/contentView', 'domReady!'
], 
	function (Marionette, ToolbarView, Toolbar, ToolbarButtons, contentView) {
		var toolbar = new Toolbar({ id: 'article' });
		var buttons = new ToolbarButtons();

		var article = new (Marionette.Layout.extend({
			template: '#template-article',
			tagName: 'section',
			className: 'region',
			regions: {
				toolbar: '.toolbar',
				content: 'header'
			},
			handleSpace: function() {
				var cw = $('iframe').get(0).contentWindow;
				var d = $('iframe').get(0).contentWindow.document;
				if (d.documentElement.clientHeight + $(d.body).scrollTop() >= d.body.offsetHeight ) {
					topWindow.frames[1].postMessage({ action: 'give-me-next' }, '*');
				} else {
					cw.scrollBy(0, d.documentElement.clientHeight * 0.85);
				}
			},
			handleKeyDown: function(e) {
				if (document.activeElement && document.activeElement.tagName == 'INPUT') {
					return;
				}

				if (e.keyCode == 49 && e.shiftKey) {
					topWindow.frames[0].focus();
					e.preventDefault();
				} else if (e.keyCode == 50 && e.shiftKey) {
					topWindow.frames[1].focus();
					e.preventDefault();
				} else if (e.keyCode == 38) {
					var cw = $('iframe').get(0).contentWindow;
					cw.scrollBy(0, -40);
					e.preventDefault();
				} else if (e.keyCode == 40) {
					var cw = $('iframe').get(0).contentWindow;
					cw.scrollBy(0, 40);
					e.preventDefault();
				} else if (e.keyCode == 32) {
					this.handleSpace();
					e.preventDefault();
				} else if (e.keyCode == 33) {
					var cw = $('iframe').get(0).contentWindow;
					var d = $('iframe').get(0).contentWindow.document;
					cw.scrollBy(0, -d.documentElement.clientHeight * 0.85);
					e.preventDefault();
				} else if (e.keyCode == 34) {
					var cw = $('iframe').get(0).contentWindow;
					var d = $('iframe').get(0).contentWindow.document;
					cw.scrollBy(0, d.documentElement.clientHeight * 0.85);
					e.preventDefault();
				} else if (e.keyCode == 35) {
					var cw = $('iframe').get(0).contentWindow;
					var d = $('iframe').get(0).contentWindow.document;
					cw.scrollTo(0, d.documentElement.offsetHeight);
					e.preventDefault();
				} else if (e.keyCode == 36) {
					var cw = $('iframe').get(0).contentWindow;
					var d = $('iframe').get(0).contentWindow.document;
					cw.scrollTo(0, 0);
					e.preventDefault();
				} else if (e.keyCode == 68 || e.keyCode == 46) {
					toolbar.handleButtonDelete(e);
					e.preventDefault();
				} else if (e.keyCode == 75) {
					toolbar.handleButtonRead();
					e.preventDefault();
				}
			}
			
		}));

		article.on('show', function() {
			this.toolbar.show( new ToolbarView({ model: toolbar, collection: buttons }) );
			this.content.show( contentView.attach() );
		});
		

		return article;
	}
);