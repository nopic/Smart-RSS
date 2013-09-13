define(['marionette', 'views/TopView'], function(Marionette, TopView) {
	var SourceView = TopView.extend({
		events: {
			'mouseup': 'handleMouseUp',
			'click': 'handleMouseDown',
		},
		className: 'list-item source',
		list: null,
		initialize: function(opt, list) {
			this.list = list;
			this.el.setAttribute('draggable', 'true');
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.handleModelDestroy, this);
			this.model.on('change:title', this.handleChangeTitle, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);
			this.el.dataset.id = this.model.get('id');
			this.el.view = this;
		},
		handleClearEvents: function(id) {
			if (window == null || id == window.top.tabID) {
				this.clearEvents();
			}
		},
		clearEvents: function() {
			this.model.off('change', this.render, this);
			this.model.off('destroy', this.handleModelDestroy, this);
			this.model.off('change:title', this.handleChangeTitle, this);
			bg.sources.off('clear-events', this.handleClearEvents, this);
		},
		handleChangeTitle: function() {
			this.list.placeSource(this);
		},
		handleModelDestroy: function(e) {
			this.list.destroySource(this);
		},
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

			if (this.model.get('folderID')) {
				this.el.dataset.inFolder = this.model.get('folderID');
			} else {
				this.$el.removeClass('in-closed-folder');
				delete this.el.dataset.inFolder;
			}

			
			this.$el.attr('title', 
				this.model.get('title') + ' (' + this.model.get('count') + ' ' + bg.lang.c.UNREAD + ', ' + this.model.get('countAll') + ' ' + bg.lang.c.TOTAL + ')'
			);
			this.$el.html(this.template(this.model.toJSON()));
			this.renderInterval = null;

			return this;
		}
	});

	return SourceView;
});