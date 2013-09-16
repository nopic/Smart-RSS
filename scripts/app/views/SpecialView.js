define(['jquery', 'underscore', 'views/TopView'], function($, _, TopView) {
	var SpecialView = TopView.extend({
		className: 'list-item special',
		template: _.template($('#template-special').html()),
		events: {
			'mouseup': 'handleMouseUp',
			'click': 'handleMouseDown'
		},
		showContextMenu: function(e) {
			if (!this.contextMenu) return;
			app.feeds.feedList.select(this, e);
			this.contextMenu.currentSource = this.model;
			this.contextMenu.show(e.clientX, e.clientY);
		},
		initialize: function() {
			this.el.view = this;
			if (this.model.get('onReady')) {
				this.model.get('onReady').call(this);
			}
			bg.info.on('change', this.changeInfo, this);
			bg.sources.on('clear-events', this.clearEvents, this);
		},
		clearEvents: function() {
			bg.info.off('change', this.changeInfo, this);
			bg.sources.off('clear-events', this.clearEvents, this);
		},
		changeInfo: function() {
			if (this.model.get('name') == 'all-feeds') {
				this.$el.attr('title', this.model.get('title') + ' (' + bg.info.get('allCountUnread') + ' ' + bg.lang.c.UNREAD + ', ' + bg.info.get('allCountTotal') + ' ' + bg.lang.c.TOTAL + ')');
			} else if (this.model.get('name') == 'trash') {
				var tot = bg.info.get('trashCountTotal');
				this.$el.attr('title', this.model.get('title') + ' (' + bg.info.get('trashCountUnread') + ' ' + bg.lang.c.UNREAD + ', ' + tot + ' ' + bg.lang.c.TOTAL + ')');
				if (tot <= 0 && this.model.get('icon') != 'trashsource.png') {
					this.model.set('icon', 'trashsource.png');
					this.render(true);
				} else if (tot > 0 && tot < 100 && this.model.get('icon') != 'trash_full.png') {
					this.model.set('icon', 'trash_full.png');
					this.render(true);
				} else if (tot >= 100 && this.model.get('icon') != 'trash_really_full.png') {
					this.model.set('icon', 'trash_really_full.png');
					this.render(true);
				}
			}
		},
		render: function(noinfo) {
			this.$el.html(this.template(this.model.toJSON()));
			if (!noinfo) this.changeInfo();
			return this;
		}
	});
	
	return SpecialView;
});