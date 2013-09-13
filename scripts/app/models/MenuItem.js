define(['backbone'], function(BB) {
	var MenuItem = BB.Model.extend({
		defaults: {
			'title': '<no title>',
			'action': null
		}
	});

	return MenuItem;
});