define([], function() {
	Array.prototype.last = function(val) {
		if (!this.length) return null;
		if (val) this[this.length - 1] = val;
		return this[this.length - 1];
	};

	Array.prototype.first = function(val) {
		if (!this.length) return null;
		if (val) this[0] = val;
		return this[0];
	};

	HTMLCollection.prototype.indexOf = Array.prototype.indexOf;

	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

	if (!Element.prototype.hasOwnProperty('matchesSelector')) {
		Element.prototype.matchesSelector = Element.prototype.webkitMatchesSelector;
	}

	Element.prototype.findNext = function(query) {
		var cur = this;
		while (cur = cur.nextElementSibling) {
			if (cur.matchesSelector(query)) {
				return cur;
			}
		}
		return null;
	};

	Element.prototype.findPrev = function(query) {
		var cur = this;
		while (cur = cur.previousElementSibling) {
			if (cur.matchesSelector(query)) {
				return cur;
			}
		}
		return null;
	};

	RegExp.escape = function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};
});