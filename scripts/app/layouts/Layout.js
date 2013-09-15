define(['backbone'], function(BB) {
	var Layout = BB.View.extend({
		attach: function(name, view) {
			this[name] = view;
			if (!view.el.parentNode) {
				this.$el.append(view.el);
			}
			view.trigger('attached');
		}
	});

	return Layout;
});