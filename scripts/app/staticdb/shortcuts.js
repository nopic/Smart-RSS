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