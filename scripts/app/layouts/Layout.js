/**
 * @module App
 * @submodule layouts/Layout
 */
define(['backbone'], function(BB) {

	/**
	 * Layout abstract class
	 * @class Layout
	 * @constructor
	 * @extends Backbone.View
	 */
	var Layout = BB.View.extend({
		/**
		 * Gives focus to layout region
		 * @method setFocus
		 * @param name {String} Name of the region
		 */
		setFocus: function(name) {
			if (!name || !this[name]) return;
			this[name].el.focus();
		},
		/**
		 * Appends new region to layout
		 * @method attach
		 * @param name {String} Name of the region
		 * @param view {Backbone.View} Backbone view to be the attached region
		 */
		attach: function(name, view) {
			this[name] = view;
			if (!view.el.parentNode) {
				this.$el.append(view.el);
			}
			view.trigger('attached');
			if (!this.focus) this.setFocus(name);
		}
	});

	return Layout;
});