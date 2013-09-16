define({
	global: {
		'shift+1': 'feeds:focus',
		'shift+2': 'articles:focus',
		'shift+3': 'article:focus',
		'esc': 'global:hideContextMenus'
	},
	feeds: {

	},
	articles: {
		'd': 'articles:delete',
		'del': 'articles:delete',
		'ctrl+f': 'articles:focusSearch',
		'enter': 'articles:fullArticle',
		'k': 'articles:mark',
		'j': 'articles:selectNext',
		'down': 'articles:selectNext',
		'u': 'articles:selectPrevious',
		'up': 'articles:selectPrevious',
		'g': 'articles:markAndNextUnread',
		't': 'articles:markAndPrevUnread',
		'h': 'articles:nextUnread',
		'y': 'articles:prevUnread',
		'z': 'articles:prevUnread',
		'ctrl+shift+a': 'articles:markAllAsRead',
		'ctrl+a': 'articles:selectAll',
		'p': 'articles:pin',
		'n': 'articles:undelete',
		'space': 'articles:spaceThrough',
		'r': 'article:update'
	},
	article: {

	}
});

/****
if (e.keyCode == 50 && e.shiftKey) {
	window.top.frames[1].focus();
	e.preventDefault();
} else if (e.keyCode == 51 && e.shiftKey) {
	window.top.frames[2].focus();
	e.preventDefault();
} else if (e.keyCode == 38) {
	var cs = $('.selected:first');
	var s;
	if (cs.length) {
		s = cs.prevAll('.list-item:not(.in-closed-folder):first').get(0);
	} else {
		s = $('.list-item:not(.in-closed-folder):last').get(0);
	}
	if (s) s.view.select();
	e.preventDefault();
} else if (e.keyCode == 40) {
	var cs = $('.selected:first');
	var s;
	if (cs.length) {
		s = cs.nextAll('.list-item:not(.in-closed-folder):first').get(0);
	} else {
		s = $('.list-item:not(.in-closed-folder):first').get(0);
	}
	if (s) s.view.select();
	e.preventDefault();
} else if (e.keyCode == 37 && e.ctrlKey) {
	var folders = $('.folder.opened');
	if (!folders.length) return;
	folders.each(function(i, folder) {
		if (folder.view) {
			folder.view.handleClickArrow(e);
		}
	});
} else if (e.keyCode == 39 && e.ctrlKey) {
	var folders = $('.folder:not(.opened)');
	if (!folders.length) return;
	folders.each(function(i, folder) {
		if (folder.view) {
			folder.view.handleClickArrow(e);
		}
	});
} else if (e.keyCode == 37) {
	var cs = $('.selected:first');
	if (cs.length && cs.hasClass('folder')) {
		cs.get(0).view.handleClickArrow(e);
	}
	e.preventDefault();
} else if (e.keyCode == 39) {
	var cs = $('.selected:first');
	if (cs.length) {
		cs.get(0).view.showSourceItems({ noSelect: true, shiftKey: e.shiftKey, noFocus: true });
	}
	e.preventDefault();
} else if (e.keyCode == 13) {
	var cs = $('.selected:first');
	if (cs.length) {
		cs.get(0).view.showSourceItems({ noSelect: true, shiftKey: e.shiftKey });
	}
	e.preventDefault();
}

****/


/****

if (e.keyCode == 49 && e.shiftKey) {
	topWindow.frames[0].focus();
	e.preventDefault();
} else if (e.keyCode == 50 && e.shiftKey) {
	topWindow.frames[1].focus();
	e.preventDefault();
} else if (e.keyCode == 38) {
	var cw = $('iframe').get(0).contentWindow;
	cw.scrollBy(0, -40);
	e.preventDefault();
} else if (e.keyCode == 40) {
	var cw = $('iframe').get(0).contentWindow;
	cw.scrollBy(0, 40);
	e.preventDefault();
} else if (e.keyCode == 32) {
	this.handleSpace();
	e.preventDefault();
} else if (e.keyCode == 33) {
	var cw = $('iframe').get(0).contentWindow;
	var d = $('iframe').get(0).contentWindow.document;
	cw.scrollBy(0, -d.documentElement.clientHeight * 0.85);
	e.preventDefault();
} else if (e.keyCode == 34) {
	var cw = $('iframe').get(0).contentWindow;
	var d = $('iframe').get(0).contentWindow.document;
	cw.scrollBy(0, d.documentElement.clientHeight * 0.85);
	e.preventDefault();
} else if (e.keyCode == 35) {
	var cw = $('iframe').get(0).contentWindow;
	var d = $('iframe').get(0).contentWindow.document;
	cw.scrollTo(0, d.documentElement.offsetHeight);
	e.preventDefault();
} else if (e.keyCode == 36) {
	var cw = $('iframe').get(0).contentWindow;
	cw.scrollTo(0, 0);
	e.preventDefault();
} else if (e.keyCode == 68 || e.keyCode == 46) {
	toolbar.handleButtonDelete(e);
	e.preventDefault();
} else if (e.keyCode == 75) {
	toolbar.handleButtonRead();
	e.preventDefault();
}
****/