define(['backbone', 'jquery', 'underscore', 'views/feedList'], function(BB, $, _) {
	var TopView = BB.View.extend({
		tagName: 'div',
		className: 'list-item',
		template: _.template($('#template-source').html()),
		handleMouseUp: function(e) {
			if (e.which == 3) {
				this.showContextMenu(e);
			}
		},
		showSourceItems: function(e) {
			e = e || {};
			
			/****hasNew state is not changed when folder is selected****/
			if (this.model.get('name') == 'all-feeds') {
				bg.sources.forEach(function(source) {
					if (source.get('hasNew')) {
						source.save({ hasNew: false });
					}
				});
				
			} else if (this.model instanceof bg.Source && this.model.get('hasNew')) {
				this.model.save({ hasNew: false });
			}


			app.trigger('select:' + require('views/feedList').el.id, this.getSelectData(e));
			
		},
		getSelectData: function(e) {
			return {
				action: 'new-select',
				// _.extend is important, because otherwise it would be sent by reference
				value: this.model.id || _.extend({}, this.model.get('filter')),
				name: this.model.get('name'),
				unreadOnly: !!e.altKey
			};
		},
		setTitle: function(unread, total) {
			this.$el.attr('title',
				this.model.get('title') + ' (' + unread + ' ' + bg.lang.c.UNREAD + ', ' + total + ' ' + bg.lang.c.TOTAL + ')'
			);
		}
	});

	return TopView;
});