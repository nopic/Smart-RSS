define(['marionette', 'views/ToolbarButtonView'], 
	function (Marionette, ToolbarButtonView) {
		var ToolbarView = Marionette.CollectionView.extend({
			itemView: ToolbarButtonView,
			tagName: 'div',
			className: 'toolbar',
			buttonPosition: 'left',
			//buttons: new ToolbarButtons(),
			events: {
				'click .button': 'handleButtonClick',
				'input input[type=search]': 'handleButtonClick'
			},
			initialize: function() {
				//this.collection = this.buttons;
				this.el.view = this;

				this.model.get('actions').forEach(this.addButton, this);
			},
			addButton: function(action) {	
				if (action == '!right')	{
					this.buttonPosition = 'right';
					return null;
				}
				this.collection.add({ actionName: action, position: this.buttonPosition });
			},
			handleButtonClick: function(e) {
				var button = e.currentTarget.view.model;
				app.actions.execute(button.get('actionName'), e);
			}
		});

		return ToolbarView;
	}
);