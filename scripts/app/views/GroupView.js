define(['backbone'], function(BB) {
	var GroupView = BB.View.extend({
		tagName: 'div',
		className: 'date-group',
		initialize: function() {
			this.el.view = this;
			/****groups.on('reset', this.handleReset, this);
			groups.on('remove', this.handleRemove, this);****/
		},
		render: function() {
			this.$el.html(this.model.get('title'));
			return this;
		},
		handleRemove: function(model) {
			if (model == this.model) {
				this.handleReset();
			}
		},
		handleReset: function() {
			/****groups.off('reset', this.handleRemove, this);
			groups.off('remove', this.handleRemove, this);****/
			this.$el.remove();
		}
	});

	return GroupView;
});