define([], function() {
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;'
	};

	var escapeHtml = function(str) {
		var str = String(str).replace(/[&<>"']/gm, function (s) {
		  return entityMap[s];
		});
		str = str.replace(/\s/, function(f) {
			if (f == ' ') return ' ';
			return '';
		});
		return str;
	}

	return escapeHtml;
});