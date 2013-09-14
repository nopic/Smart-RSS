define(['marionette', 'domReady!', 'collections/Actions', 'layouts/feeds', 'layouts/articles', 'layouts/article', 'preps/all'], 
function (Marionette, doc, Actions, feeds, articles, article) {

	//$('body').html( bg.translate($('body').html()) );
	document.documentElement.style.fontSize = bg.settings.get('uiFontSize') + '%';

	var templates = $('script[type="text/template"]');
	templates.each(function(i, el) {
		el.innerHTML = bg.translate(el.innerHTML);
	});

	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();
	});	

	var app = window.app = new Marionette.Application({
		fixURL: function(url) {
			if (url.search(/[a-z]+:\/\//) == -1) {
				url = 'http://' + url;
			}
			return url;
		}
	});





	document.addEventListener('keydown', function(e) {
		if (document.activeElement && document.activeElement.tagName == 'INPUT') {
			return;
		}

		if (e.keyCode == 68 || e.keyCode == 46) { // D, DEL
			if (articleList.specialName == 'trash' || e.shiftKey) {
				articleList.destroyBatch(articleList.selectedItems, articleList.removeItemCompletely);
			} else {
				articleList.destroyBatch(articleList.selectedItems, articleList.removeItem);
			}
			e.preventDefault();
		} else if (e.keyCode == 70 && e.ctrlKey) { // CTRL+F
			$('#input-search').focus();
			e.preventDefault();
		} else if (e.keyCode == 49 && e.shiftKey) { // SHIFT+1
			topWindow.frames[0].focus();
			e.preventDefault();
		} else if (e.keyCode == 13) { // ENTER
			if (!articleList.selectedItems.length) return;
			articleList.handleItemDblClick({ currentTarget: articleList.selectedItems[0].el, shiftKey: e.shiftKey });
			e.preventDefault();
		} else if (e.keyCode == 51  && e.shiftKey) { // SHIFT+3
			topWindow.frames[2].focus();
			e.preventDefault();
		} else if (e.keyCode == 75) { // K - mark as read/unread
			articleList.changeUnreadState();
			e.preventDefault();
		} else if (e.keyCode == 40 || e.keyCode == 74) { // arrow down, J
			app.actions.execute('articles:selectNext', e);
			e.preventDefault();
		} else if (e.keyCode == 38 || e.keyCode == 85) { // arrow up, U
			app.actions.execute('articles:selectPrevious', e);
			e.preventDefault();
		} else if (e.keyCode == 71) { // G - mark as read and go to next unread
			articleList.changeUnreadState({ onlyToRead: true });
			articleList.selectNext({ selectUnread: true });
			e.preventDefault();
		}  else if (e.keyCode == 84) { // T - mark as read and go to prev unread
			articleList.changeUnreadState({ onlyToRead: true });
			articleList.selectPrev({ selectUnread: true });
			e.preventDefault();
		} else if (e.keyCode == 72) { // H = go to next unread
			articleList.selectNext({ selectUnread: true });
			e.preventDefault();
		} else if (e.keyCode == 89 || e.keyCode == 90) { // Y/Z = go to prev unread
			articleList.selectPrev({ selectUnread: true });
			e.preventDefault();
		} else if (e.keyCode == 65 && e.ctrlKey && e.shiftKey) { // A = Mark all as read
			if (articleList.currentSource) {
				var id = articleList.currentSource.get('id');
				if (!id) return;
				bg.items.forEach(function(item) {
					if (item.get('unread') == true && item.getSource().id == id) {
						item.save({ unread: false, visited: true });
					}
				});
			} else if (articleList.specialName == 'all-feeds') {
				if (confirm(bg.lang.c.MARK_ALL_QUESTION)) {
					bg.items.forEach(function(item) {
						if (item.get('unread') == true) {
							item.save({ unread: false, visited: true });
						}
					});	
				}
			} else if (articleList.specialName) {
				bg.items.where(articleList.specialFilter).forEach(function(item) {
					item.save({ unread: false, visited: true });
				});
			} 
			e.preventDefault();
		} else if (e.keyCode == 65 && e.ctrlKey) { // A = Select all
			$('.selected').removeClass('selected');
			articleList.selectedItems = [];
			$('.item:not(.invisible)').each(function(i, item) {
				item.view.$el.addClass('selected');
				articleList.selectedItems.push(item.view);
			});

			$('.last-selected').removeClass('last-selected');
			$('.item:not(.invisible):last').addClass('last-selected');
			e.preventDefault();
		} else if (e.keyCode == 80) { // P
			if (!articleList.selectedItems || !articleList.selectedItems.length) return;
			var val = !articleList.selectedItems[0].model.get('pinned');
			articleList.selectedItems.forEach(function(item) {
				item.model.save({ pinned: val });
			});
			e.preventDefault();
		} else if (e.keyCode == 27) { // ESC
			if (contextMenus.get('items').el.parentNode) {
				// make sure the action gets executed
				contextMenus.get('items').hide();
				e.preventDefault();
			}
		} else if (e.keyCode == 78) { // N = Undelete item
			if (!articleList.selectedItems || !articleList.selectedItems.length || articleList.specialName != 'trash') return;
			articleList.destroyBatch(articleList.selectedItems, articleList.undeleteItem);				
			e.preventDefault();
		} else if (e.keyCode == 32) { // Space = Space through items
			if (!articleList.selectedItems || !articleList.selectedItems.length) return;
			topWindow.frames[2].postMessage({ action: 'space-pressed' }, '*');
			e.preventDefault();
		} else if (e.keyCode == 82) { // R - Reload current
			toolbar.refreshItems();
			e.preventDefault();
		}

		
	});





	app.actions = new Actions();

	app.addRegions({
		feeds: '#region-feeds',
		articles: '#region-articles',
		article: '#region-article'
	});

	app.feeds.show(feeds);
	app.articles.show(articles);
	app.article.show(article);

	app.on('start', function() {
		console.log('app started');
	});

	return app;
});	