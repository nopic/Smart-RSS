define(['backbone', 'instances/contextMenus', 'jquery', 'underscore'], function(BB, contextMenus, $, _) {
	var TopView = BB.View.extend({
		tagName: 'div',
		className: 'list-item',
		template: _.template($('#template-source').html()),
		handleMouseDown: function(e) {
			if (e.which == 1) {
				this.showSourceItems(e);
			}
		},
		handleMouseUp: function(e) {
			if (e.which == 3) {
				this.showContextMenu(e);
			}
		},
		showContextMenu: function(e) {
			app.feeds.feedList.select(this, e);
			contextMenus.get('sources').currentSource = this.model;
			contextMenus.get('sources').show(e.clientX, e.clientY);
		},
		showSourceItems: function(e) {
			e = e || {};
			if (!e.noSelect) app.feeds.feedList.select(this, e);
			
			if (this.model.get('name') == 'all-feeds') {
				bg.sources.forEach(function(source) {
					if (source.get('hasNew')) {
						source.save({ hasNew: false });
					}
				});
				
			} else if (this.model instanceof bg.Source && this.model.get('hasNew')) {
				this.model.save({ hasNew: false });
			}
			
		},
		getSelectData: function(e) {
			return {
				action: 'new-select',
				value: this.model.id || this.model.get('filter'),
				name: this.model.get('name'),
				unreadOnly: !!e.shiftKey,
				noFocus: !!e.noFocus
			};
		}
	});

	return TopView;
});