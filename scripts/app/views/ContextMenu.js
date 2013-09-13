define(['backbone', 'collections/MenuCollection', 'views/MenuItemView'], function(BB, MenuCollection, MenuItemView) {
	var ContextMenu = BB.View.extend({
		tagName: 'div',
		className: 'context-menu',
		menuCollection: null,
		addItem: function(item) {
			var v = new MenuItemView({
				model: item
			});
			v.contextMenu = this;
			this.$el.append(v.render().$el);
		},
		addItems: function(items) {
			items.forEach(function(item) {
				this.addItem(item);
			}, this);
		},
		render: function() {
			return this;
		},
		hide: function() {
			if (this.$el.css('display') == 'block') {
				this.$el.css('display', 'none');
			}
		},
		initialize: function(mc) {
			this.menuCollection = new MenuCollection(mc);
			this.addItems(this.menuCollection);
			$('body').append(this.render().$el);

			window.addEventListener('blur', this.hide.bind(this));
			window.addEventListener('resize', this.hide.bind(this));
		},
		show: function(x, y) {
			if (x + this.$el.width() + 4 > document.body.offsetWidth) {
				x = document.body.offsetWidth - this.$el.width() - 8;
			} 
			if (y + this.$el.height() + 4 > document.body.offsetHeight) {
				y = document.body.offsetHeight - this.$el.height() - 8;
			} 
			this.$el.css('top', y + 'px');
			this.$el.css('left', x + 'px');
			this.$el.css('display', 'block');
		}
	});

	return ContextMenu;
});