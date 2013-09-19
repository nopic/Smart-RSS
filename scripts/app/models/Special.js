/**
 * @module App
 * @submodule models/Special
 */
define(['backbone'], function(BB) {
	/**
	 * Model for special items in feed list like all-feeds, pinned and trash
	 * @class Special
	 * @constructor
	 * @extends Backbone.Model
	 */
	var Special = BB.Model.extend({
		defaults: {
			/**
			 * @attribute title
			 * @type String
			 * @default All feeds
			 */
			title: 'All feeds',

			/**
			 * @attribute icon
			 * @type String
			 * @default icon16_v2.png
			 */
			icon: 'icon16_v2.png',

			/**
			 * @attribute name
			 * @type String
			 * @default ''
			 */
			name: '',

			/**
			 * @attribute filter
			 * @type Object
			 * @default {}
			 */
			filter: {},

			/**
			 * Should the special be above or below feed sources?
			 * @attribute position
			 * @type String
			 * @default top
			 */
			position: 'top',

			/**
			 * Function to be called when specials view is initialized
			 * @attribute onReady
			 * @type function
			 * @default null
			 */
			onReady: null
		}
	});

	return Special;
});