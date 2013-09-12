define(['backbone', 'models/ToolbarButton'], function (BB, ToolbarButton) {
	var ToolbarButtons = BB.Collection.extend({
		model: ToolbarButton,
	});

	return ToolbarButtons;
});