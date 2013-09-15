define(['backbone'], function(BB) {
	var Layout = BB.View.extend({
		focus: null,
		setFocus: function(name) {
			if (!name || !this[name] || name == this.focus) return;
			if (this.focus) this[this.focus].trigger('blur');
			this.focus = name;
			this[name].trigger('focus');
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