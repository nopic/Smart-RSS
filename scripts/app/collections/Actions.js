define(['backbone', 'models/Action', 'app', 'staticdb/actions'], function (BB, Action, app, db) {
	var Actions = BB.Collection.extend({
		model: Action,

		/**
		 * Constructor
		 */
		initialize: function() {
			for (region in db) {
				for (name in db[region]) {
					this.add({ name: region + ':' + name, fn: db[region][name].fn, icon: db[region][name].icon });
				}
			}
		},

		/**
		 * Executes given action
		 * @action string | models/Action
		 */
		execute: function(action) {
			if (typeof action == 'string') action = this.findWhere({ name: action });
			if (!action) return false;
			action.fn.apply(app, arguments);
			return true;
		}
	});

	return Actions;
});