define([], function() {
	var _unixutcoff = (new Date).getTimezoneOffset() * 60000;
	var unixutc = function(date) {
		return date.getTime() - _unixutcoff;
	}
	return unixutc;
});