define(['marionette', 'views/ToolbarButtonView'], 
	function (Marionette, ToolbarButtonView) {
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
				this.collection.add({ actionName: action });
			},
			handleButtonClick: function(e) {
				var button = e.currentTarget.view.model;
				app.actions.execute(button.get('actionName'));
			}
		});

		return ToolbarView;
	}
);