define(['backbone'], function (BB) {
	var ToolbarButton = BB.Model.extend({
		defaults: {
			actionName: 'global:default'
		}
	});

	return ToolbarButton;
});