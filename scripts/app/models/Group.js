define(['backbone'], function(BB) {
	var Group = BB.Model.extend({
		defaults: {
			title: '<no title>',
			date: 0
		},
		idAttribute: 'date'
	});

	return Group;
});