define(['backbone'], function(BB) {
	var Layout = BB.View.extend({
		setFocus: function(name) {
			if (!name || !this[name]) return;
			this[name].el.focus();
		},
		attach: function(name, view) {
			this[name] = view;
			if (!view.el.parentNode) {
				this.$el.append(view.el);
			}
			view.trigger('attached');
			if (!this.focus) this.setFocus(name);
		}
	});

	return Layout;
});