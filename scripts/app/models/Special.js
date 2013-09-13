define(['backbone'], function(BB) {
	var Special = BB.Model.extend({
		defaults: {
			title: 'All feeds',
			icon: 'icon16_v2.png',
			name: '',
			filter: {},
			position: 'top',
			onReady: null
		}
	});

	return Special;
});