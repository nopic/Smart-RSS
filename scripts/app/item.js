
function utf8_to_b64( str ) {
	return btoa(unescape(encodeURIComponent( str )));
}


chrome.runtime.getBackgroundPage(function(bg) {

$(function() {

	// Do not transalte whole body at once to prevent iframe readd
	$('.overlay').html( bg.translate($('.overlay').html()) );

	/*try {
		$('iframe').get(0).contentDocument.querySelector('#smart-rss-url').innerHTML = bg.lang.c.FULL_ARTICLE;
	} catch(e) {}

	$('iframe').load(function() {
		$('iframe').get(0).contentDocument.querySelector('#smart-rss-url').innerHTML = bg.lang.c.FULL_ARTICLE;
	});*/

	var toolbar = new (Backbone.View.extend({
		el: '#toolbar',
		events: {
			'click #button-config': 'handleButtonConfig',
		},
		handleButtonConfig: function() {
			overlay.show();
		}
	}));



	var overlay = new (Backbone.View.extend({
		el: '.overlay',
		events: {
			'click #config-layout input[type=image]': 'handleLayoutChange',
			'change select': 'handleSelectChange',
		},
		initialize: function() {
			window.addEventListener('blur', this.hide.bind(this));
			window.addEventListener('resize', this.hide.bind(this));
		},
		render: function() {
			var layout = bg.settings.get('layout');
			if (layout == 'vertical') {
				$('#config-layout input[value=horizontal]').attr('src', '/images/layout_horizontal.png');
				$('#config-layout input[value=vertical]').attr('src', '/images/layout_vertical_selected.png');
			} else {
				$('#config-layout input[value=horizontal]').attr('src', '/images/layout_horizontal_selected.png');
				$('#config-layout input[value=vertical]').attr('src', '/images/layout_vertical.png');
			}
			this.$el.find('#config-lines').val(bg.settings.get('lines'));
			this.$el.find('#config-sort-order').val(bg.settings.get('sortOrder'));
			return this;
		},
		handleSelectChange: function(e) {
			bg.settings.save(e.currentTarget.dataset.name, e.currentTarget.value);
		},
		handleLayoutChange: function(e) {
			var layout = e.currentTarget.value;
			bg.settings.save('layout', layout);
			this.hide();
		},
		hide: function() {
			this.$el.css('display', 'none');
		},
		show: function() {
			this.render().$el.css('display', 'block');
		},
		isVisible: function() {
			return this.$el.css('display') == 'block';
		}
	}));

	var itemView = new (Backbone.View.extend({
		el: 'body',
		
	}));


	var log = new (Backbone.View.extend({
		el: 'footer',
		events: {
			'click #button-hide-log': 'hide'
		},
		initialize: function() {
			bg.logs.on('add', this.addItem, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);
		},
		handleClearEvents: function(id) {
			if (window == null || id == window.top.tabID) {
				bg.logs.off('add', this.addItem, this);
				bg.sources.off('clear-events', this.handleClearEvents, this);
			}
		},
		addItem: function(model) {
			this.$el.css('display', 'block');
			$('<div class="log">' + formatDate(new Date, 'hh:mm:ss') + ': ' + model.get('message') + '</div>').insertAfter(this.$el.find('#button-hide-log'));
		},
		hide: function() {
			this.$el.css('display', 'none');
		}
	}));

});

});