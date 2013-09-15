define(['backbone', 'views/TopView', 'instances/contextMenus'], function(BB, TopView, contextMenus) {
	var FolderView = TopView.extend({
		className: 'list-item folder',
		template: _.template($('#template-folder').html()),
		list: null,
		events: {
			'dblclick': 'handleDoubleClick',
			'mouseup': 'handleMouseUp',
			'click': 'handleMouseDown',
			'click .folder-arrow': 'handleClickArrow'
		},
		handleDoubleClick: function(e) {
			this.handleClickArrow(e);
		},
		showContextMenu: function(e) {
			this.select(e);
			contextMenus.get('folder').currentSource = this.model;
			contextMenus.get('folder').show(e.clientX, e.clientY);
		},
		initialize: function(opt, list) {
			this.list = list;
			this.el.view = this;

			this.model.on('destroy', this.handleModelDestroy, this);
			this.model.on('change', this.render, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);

			this.el.dataset.id = this.model.get('id');
		},
		clearEvents: function() {
			this.model.off('destroy', this.handleModelDestroy, this);
			this.model.off('change', this.render, this);
			bg.sources.off('clear-events', this.handleClearEvents, this);
		},
		handleModelDestroy: function(e) {
			this.list.destroySource(this);
		},
		handleClickArrow: function(e) {
			this.model.save('opened', !this.model.get('opened'));
			$('.source[data-in-folder=' + this.model.get('id') + ']').toggleClass('in-closed-folder', !this.model.get('opened'));
			e.stopPropagation();
		},
		template: _.template($('#template-folder').html()),
		renderInterval: 'first-time',
		render: function() {
			if (this.renderInterval == 'first-time') return this.realRender();
			if (this.renderInterval) return;
			
			var that = this;
			this.renderInterval = requestAnimationFrame(function() {
				that.realRender();
			});
			return this;
		},
		realRender: function() {
			this.$el.toggleClass('has-unread', !!this.model.get('count'));
			
			var data = Object.create(this.model.attributes);
			this.$el.toggleClass('opened', this.model.get('opened'));
			this.$el.html(this.template(data));

			this.$el.attr('title', 
				this.model.get('title') + ' (' + this.model.get('count') + ' ' + bg.lang.c.UNREAD + ', ' + this.model.get('countAll') + ' ' + bg.lang.c.TOTAL + ')'
			);
			this.renderInterval = null;

			return this;
		},
		showSourceItems: function(e) {
			e = e || {};
			if (!e.noSelect) this.select(e);
			
			
			window.top.frames[1].postMessage({
				action: 'new-folder-select',
				value: this.model.id,
				unreadOnly: !!e.shiftKey,
				noFocus: !!e.noFocus
			}, '*');
			
		}
	});
	
	return FolderView;
});