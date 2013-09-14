define(['backbone'], function (BB) {
	var ToolbarButton = BB.Model.extend({
		defaults: {
			actionName: 'global:default',
			position: 'left'
		}
	});

	return ToolbarButton;
});