define(['marionette'], function(Marionette) {
	Marionette.Region.prototype.open = function(view) {
		this.$el.replaceWith(view.el);
	};

	Marionette.Region.prototype.realClose = Marionette.Region.prototype.close;

	Marionette.Region.prototype.close = function(view) {
		if (this.currentView) {
			this.currentView.$el.replaceWith(this.$el);
			this.realClose(view);
		}
	};
});