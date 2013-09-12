define(['marionette', 'app', 'views/ToolbarButtonView'], 
	function (Marionette, app, ToolbarButtonView) {
		var ToolbarView = Marionette.CollectionView.extend({
			itemView: ToolbarButtonView,
			tagName: 'div',
			className: 'toolbar',
			//buttons: new ToolbarButtons(),
			events: {
				'click .button': 'handleButtonClick'
			},
			initialize: function() {
				//this.collection = this.buttons;
				this.el.view = this;

				this.model.get('actions').forEach(this.addButton, this);
			},
			addButton: function(action) {				
				this.collection.add({ action: action });
			},
			handleButtonClick: function(e) {
				var button = e.currentTarget.view.model;
				app.actions.execute(button.get('action'));
			}
		});

		return ToolbarView;
	}
);