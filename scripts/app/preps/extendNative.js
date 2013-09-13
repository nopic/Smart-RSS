define([], function() {
	Array.prototype.last = function(val) {
		if (!this.length) return null;
		if (val) this[this.length - 1] = val;
		return this[this.length - 1];
	};

	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

	if (!Element.prototype.hasOwnProperty('matchesSelector')) {
		Element.prototype.matchesSelector = Element.prototype.webkitMatchesSelector;
	}

});