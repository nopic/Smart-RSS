define(['backbone'], function (BB) {
	var ToolbarButton = BB.Model.extend({
		defaults: {
			action: 'global:default'
		}
	});

	return ToolbarButton;
});