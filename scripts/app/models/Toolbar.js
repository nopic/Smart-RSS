define(['backbone', 'staticdb/buttons'], function (BB, db) {
	var Toolbar = BB.Model.extend({
		defaults: {
			region: 'feeds',
			position: 'top',
			actions: [],
			firstRun: true
		},
		initialize: function() {
			if (!this.get('firstRun')) return;
			this.set({
				actions: db[this.id],
				firstRun: false
			});
		}
	});

	return Toolbar;
});