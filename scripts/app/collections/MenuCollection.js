define(['backbone', 'models/MenuItem'], function(BB, MenuItem) {
	var MenuCollection = BB.Collection.extend({
		model: MenuItem
	});

	return MenuCollection;
});