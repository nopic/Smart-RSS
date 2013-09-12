define(['backbone'], function (BB) {
	var Action = BB.Model.extend({
		defaults: {
			name: 'global:default',
			fn: function() { return function() {} },
			icon: 'unknown.png'
		}
	});

	return Action;
});