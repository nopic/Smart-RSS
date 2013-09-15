define(['backbone', 'underscore'], function(BB, _) {
	var LogView = BB.View.extend({
		tagName: 'footer',	
		events: {
			'click #button-hide-log': 'hide'
		},
		initialize: function() {
			this.template = _.template($('#template-log').html());
			this.$el.html(this.template({}));

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
	});

	return LogView;
});