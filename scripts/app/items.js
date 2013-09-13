var chrome = window.top.chrome;
var topWindow = window.top;

window.addEventListener('load', function() {
	window.focus();
})



chrome.runtime.getBackgroundPage(function(bg) {

$(function() {

	$('#input-search').attr('placeholder', bg.lang.c.SEARCH);

	

	var toolbar = new (Backbone.View.extend({
		el: '#toolbar',
		events: {
			'click #button-read': 'handleButtonRead',
			'click #button-reload': 'refreshItems',
			'click #button-delete': 'handleButtonDelete',
			'click #button-undelete': 'handleButtonUndelete',
			'input input[type=search]': 'handleSearch'
		},
		initialize: function() {
			
		},
		handleSearch: function(e) {
			var str = e.currentTarget.value || '';

			if (str == '') {
				$('.date-group').css('display', 'block');
			} else {
				$('.date-group').css('display', 'none');
			}

			var searchInContent = false;
			if (str[0] && str[0] == ':') {
				str = str.replace(/^:/, '', str);
				searchInContent = true;
			}
			var rg = new RegExp(RegExp.escape(str), 'i');
			list.views.some(function(view) {
				if (!view.model) return true;
				if (rg.test(view.model.get('title')) || rg.test(view.model.get('author')) || (searchInContent && rg.test(view.model.get('content')) )) {
					view.$el.removeClass('invisible');
				} else {
					view.$el.addClass('invisible');
				}
			});

			list.handleScroll();

			list.restartSelection();
		},
		handleButtonDelete: function(e) {
			
		},
		handleButtonUndelete: function() {
			if (list.specialName == 'trash') {
				list.destroyBatch(list.selectedItems, list.undeleteItem);
			} 
		}
	}));

	var App = Backbone.View.extend({
		el: 'body',
		events: {
			'keydown': 'handleKeyDown',
			'mousedown': 'handleMouseDown'
		},
		initialize: function() {
			window.addEventListener('resize', this.handleResize.bind(this));
		},
		handleResize: function() {
			if (bg.settings.get('layout') == 'horizontal') {
				var wid = $(window).width();
				bg.settings.save({ posB: wid + ',*' });
			} else {
				var hei = $(window).height();
				bg.settings.save({ posC: hei + ',*' });
			}
		},
		handleMouseDown: function(e) {
			if (itemsContextMenu.el.parentNode && !e.target.matchesSelector('.context-menu, .context-menu *')) {
				// make sure the action gets executed
				itemsContextMenu.hide();
			}
		},
		selectNext: function(e) {
			var e = e || {};

			var q = e.selectUnread ? '.unread:not(.invisible)' : '.item:not(.invisible)';
			var next;
			if (e.selectUnread &&  list.selectPivot) {
				next = list.selectPivot.el.nextElementSibling;
			} else {
				next = $('.last-selected').get(0).nextElementSibling;
			}
			while (next && !next.matchesSelector(q)) {
				next = next.nextElementSibling;
			}

			if (!next && !e.shiftKey && !e.ctrlKey) {
				next = list.el.querySelector(q);
				if (e.currentIsRemoved && next && $('.last-selected').get(0) == next) {
					next = [];
					topWindow.frames[2].postMessage({ action: 'no-items' }, '*');
				}
			}
			if (next && next.view) {
				next.view.select(e);
				if (!list.inView(next)) {
					next.scrollIntoView(false);	
				}
			}

		},
		selectPrev: function(e) {
			var e = e || {};
			var q = e.selectUnread ? '.unread:not(.invisible)' : '.item:not(.invisible)';
			var prev;
			if (e.selectUnread &&  list.selectPivot) {
				prev = list.selectPivot.el.previousElementSibling;
			} else {
				prev = $('.last-selected').get(0).previousElementSibling;
			}
			while (prev && !prev.matchesSelector(q)) {
				prev = prev.previousElementSibling;
			}

			if (!prev && !e.shiftKey && !e.ctrlKey) {
				prev = $(q + ':last').get(0);
				if (e.currentIsRemoved && prev && $('.last-selected').get(0) == prev) {
					prev = [];
					topWindow.frames[2].postMessage({ action: 'no-items' }, '*');
				}
			}
			if (prev && prev.view) {
				prev.view.select(e);
				if (!list.inView(prev)) {
					prev.scrollIntoView(true);	
				}
			}
		},
		handleKeyDown: function(e) {
			if (document.activeElement && document.activeElement.tagName == 'INPUT') {
				return;
			}

			if (e.keyCode == 68 || e.keyCode == 46) { // D, DEL
				if (list.specialName == 'trash' || e.shiftKey) {
					list.destroyBatch(list.selectedItems, list.removeItemCompletely);
				} else {
					list.destroyBatch(list.selectedItems, list.removeItem);
				}
				e.preventDefault();
			} else if (e.keyCode == 70 && e.ctrlKey) { // CTRL+F
				$('#input-search').focus();
				e.preventDefault();
			} else if (e.keyCode == 49 && e.shiftKey) { // SHIFT+1
				topWindow.frames[0].focus();
				e.preventDefault();
			} else if (e.keyCode == 13) { // ENTER
				if (!list.selectedItems.length) return;
				list.handleItemDblClick({ currentTarget: list.selectedItems[0].el, shiftKey: e.shiftKey });
				e.preventDefault();
			} else if (e.keyCode == 51  && e.shiftKey) { // SHIFT+3
				topWindow.frames[2].focus();
				e.preventDefault();
			} else if (e.keyCode == 75) { // K - mark as read/unread
				list.changeUnreadState();
				e.preventDefault();
			} else if (e.keyCode == 40 || e.keyCode == 74) { // arrow down, J
				this.selectNext(e);
				e.preventDefault();
			} else if (e.keyCode == 38 || e.keyCode == 85) { // arrow up, U
				this.selectPrev(e);
				e.preventDefault();
			} else if (e.keyCode == 71) { // G - mark as read and go to next unread
				list.changeUnreadState({ onlyToRead: true });
				this.selectNext({ selectUnread: true });
				e.preventDefault();
			}  else if (e.keyCode == 84) { // T - mark as read and go to prev unread
				list.changeUnreadState({ onlyToRead: true });
				this.selectPrev({ selectUnread: true });
				e.preventDefault();
			} else if (e.keyCode == 72) { // H = go to next unread
				this.selectNext({ selectUnread: true });
				e.preventDefault();
			} else if (e.keyCode == 89 || e.keyCode == 90) { // Y/Z = go to prev unread
				this.selectPrev({ selectUnread: true });
				e.preventDefault();
			} else if (e.keyCode == 65 && e.ctrlKey && e.shiftKey) { // A = Mark all as read
				if (list.currentSource) {
					var id = list.currentSource.get('id');
					if (!id) return;
					bg.items.forEach(function(item) {
						if (item.get('unread') == true && item.getSource().id == id) {
							item.save({ unread: false, visited: true });
						}
					});
				} else if (list.specialName == 'all-feeds') {
					if (confirm(bg.lang.c.MARK_ALL_QUESTION)) {
						bg.items.forEach(function(item) {
							if (item.get('unread') == true) {
								item.save({ unread: false, visited: true });
							}
						});	
					}
				} else if (list.specialName) {
					bg.items.where(list.specialFilter).forEach(function(item) {
						item.save({ unread: false, visited: true });
					});
				} 
				e.preventDefault();
			} else if (e.keyCode == 65 && e.ctrlKey) { // A = Select all
				$('.selected').removeClass('selected');
				list.selectedItems = [];
				$('.item:not(.invisible)').each(function(i, item) {
					item.view.$el.addClass('selected');
					list.selectedItems.push(item.view);
				});

				$('.last-selected').removeClass('last-selected');
				$('.item:not(.invisible):last').addClass('last-selected');
				e.preventDefault();
			} else if (e.keyCode == 80) { // P
				if (!list.selectedItems || !list.selectedItems.length) return;
				var val = !list.selectedItems[0].model.get('pinned');
				list.selectedItems.forEach(function(item) {
					item.model.save({ pinned: val });
				});
				e.preventDefault();
			} else if (e.keyCode == 27) { // ESC
				if (itemsContextMenu.el.parentNode) {
					// make sure the action gets executed
					itemsContextMenu.hide();
					e.preventDefault();
				}
			} else if (e.keyCode == 78) { // N = Undelete item
				if (!list.selectedItems || !list.selectedItems.length || list.specialName != 'trash') return;
				list.destroyBatch(list.selectedItems, list.undeleteItem);				
				e.preventDefault();
			} else if (e.keyCode == 32) { // Space = Space through items
				if (!list.selectedItems || !list.selectedItems.length) return;
				topWindow.frames[2].postMessage({ action: 'space-pressed' }, '*');
				e.preventDefault();
			} else if (e.keyCode == 82) { // R - Reload current
				toolbar.refreshItems();
				e.preventDefault();
			}

			
		} 
	});


	var app, list;

	bg.appStarted.always(function() {
		list = new AppList();
		app = new App();
	});

});


});