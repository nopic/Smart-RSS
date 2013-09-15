define([
	'layouts/Layout',  'views/ToolbarView', 'models/Toolbar', 'views/contentView', 'domReady!'
], 
	function (Layout, ToolbarView, Toolbar, contentView) {
		var toolbar = new Toolbar({ id: 'article' });

		var ArticleLayout = Layout.extend({
			template: _.template($('#template-article').html()),
			el: '#region-article',
			initialize: function() {

				this.on('attached', function() {
					this.attach('toolbar', new ToolbarView({ model: toolbar }) );
					this.attach('content', contentView );
				});
				

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
			
		});

		return ArticleLayout;
	}
);