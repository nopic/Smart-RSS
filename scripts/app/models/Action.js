define(['backbone'], function (BB) {
	var Action = BB.Model.extend({
		idAttribute: 'name',
		defaults: {
			name: 'global:default',
			fn: function() { return function() {} },
			icon: 'unknown.png',
			title: ''
		}
	});

	return Action;
});