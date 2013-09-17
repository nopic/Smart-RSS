define(['backbone', 'jquery', 'underscore'], function(BB, $, _) {

	var Properties = BB.View.extend({
		id: 'properties',
		currentSource: null,
		events: {
			'click button' : 'handleClick',
			'keydown button' : 'handleKeyDown',
			'click #advanced-switch' : 'handleSwitchClick',
		},
		initialize: function() {
			this.template = _.template($('#template-properties').html());
		},
		handleClick: function(e) {
			var t = e.currentTarget;
			if (t.id == 'prop-cancel') {
				this.hide();
			} else if (t.id == 'prop-ok') {
				this.saveData();
			}
		},
		saveData: function() {
			if (!this.currentSource) {
				this.hide();
				return;
			}

			this.currentSource.save({
				title: $('#prop-title').val(),
				url: app.fixURL($('#prop-url').val()),
				username: $('#prop-username').val(),
				password: $('#prop-password').val(),
				updateEvery: parseFloat($('#prop-update-every').val())
			});

			this.hide();

		},
		handleKeyDown: function(e) {
			if (e.keyCode == 13) {
				this.handleClick(e);
			}
		},
		render: function(source) {
			if (!source) return;

			this.$el.html(this.template(source.attributes));

			if (source.get('updateEvery')) {
				$('#prop-update-every').val(source.get('updateEvery'));
			}

			return this;
		},
		show: function(source) {
			this.render(source);
			
			this.$el.css('display', 'block');
		},
		hide: function() {
			this.$el.css('display', 'none');
		},
		handleSwitchClick: function() {
			$('#properties-advanced').toggleClass('visible');
			$('#advanced-switch').toggleClass('switched');
		}
	});

	return Properties;
});