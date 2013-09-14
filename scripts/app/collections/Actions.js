define(['backbone', 'models/Action', 'staticdb/actions'], function (BB, Action, db) {
	var Actions = BB.Collection.extend({
		model: Action,

		/**
		 * Constructor
		 */
		initialize: function() {
			var c;
			for (region in db) {
				for (name in db[region]) {
					c = db[region][name];
					this.add({ name: region + ':' + name, fn: c.fn, icon: c.icon, title: c.title });
				}
			}
		},

		/**
		 * Executes given action
		 * @action string | models/Action
		 */
		execute: function(action) {
			if (typeof action == 'string') action = this.get(action);
			if (!action) return false;
			var args = [].slice.call(arguments);
			args.shift();
			action.get('fn').apply(app, args);
			return true;
		}
	});

	return Actions;
});