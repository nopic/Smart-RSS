define({
	global: {
		default: {
			title: 'Unknown',
			fn: function() {
				alert('no action');
			}
		},
		hideContextMenus: {
			title: 'Hide Context Menus',
			fn: function() {
				require('instances/contextMenus').hideAll();
			}
		}
	},
	feeds: {
		updateAll: {
			icon: 'reload.png',
			title: bg.lang.c.UPDATE_ALL,
			fn: function() {
				bg.downloadAll(true);
			}
		},
		addSource: {
			icon: 'add.png',
			title: bg.lang.c.ADD_RSS_SOURCE,
			fn: function() {
				var url = (prompt(bg.lang.c.RSS_FEED_URL) || '').trim();
				if (!url)  return;

				var folderID = 0;
				var list = app.feeds.currentView.feedList.currentView;
				if (list.selectedItems.length && list.selectedItems[0].classLisr.contains('folder')) {
					var fid = list.selectedItems[0].model.get('id');
					// make sure source is not added to folder which is not in db
					if (bg.folders.get(fid)) {
						folderID = fid;	
					}
				}

				url = app.fixURL(url);
				bg.sources.create({
					title: url,
					url: url,
					updateEvery: 180,
					folderID: folderID
				}, { wait: true });
			}
		},
		addFolder: {
			icon: 'add_folder.png',
			title: bg.lang.c.NEW_FOLDER,
			fn: function() {
				var title = (prompt(bg.lang.c.FOLDER_NAME + ': ') || '').trim();
				if (!title) return;

				bg.folders.create({
					title: title
				}, { wait: true });
			}
		}
	},
	articles: {
		mark: {
			icon: 'read.png',
			title: bg.lang.c.MARK_AS_READ,
			fn: function() {
				require('views/articleList').changeUnreadState();
			}
		},
		update: {
			icon: 'reload.png',
			title: bg.lang.c.UPDATE,
			fn: function() {
				var list = require('views/articleList')
				if (list.currentSource) {
					bg.downloadOne(list.currentSource);	
				} else if (list.currentFolder) {
					bg.sources.forEach(function(source) {
						if (source.get('folderID') == list.currentFolder.id) {
							bg.downloadOne(source);	
						}
					});
				} else {
					bg.downloadAll(true); // true = force
				}
			}
		},
		delete: {
			icon: 'delete.png',
			title: bg.lang.c.DELETE,
			fn: function() {
				var list = require('views/articleList')
				if (list.specialName == 'trash' || e.shiftKey) {
					list.destroyBatch(list.selectedItems, list.removeItemCompletely);
				} else {
					list.destroyBatch(list.selectedItems, list.removeItem);
				}
			}
		},
		undelete: {
			icon: 'undelete.png',
			title: bg.lang.c.UNDELETE,
			fn: function() {
				var list = require('views/articleList')
				if (list.specialName == 'trash') {
					list.destroyBatch(list.selectedItems, list.undeleteItem);
				}
			}
		},
		selectNext: {
			fn: function(e) {
				require('views/articleList').selectNext(e);
			}
		},
		selectPrevious: {
			fn: function(e) {
				require('views/articleList').selectPrev(e);
			}
		},
		search: {
			title: bg.lang.c.SEARCH_TIP,
			fn: function(e) {
				e = e || {};
				var str = e.currentTarget.value || '';
				var list = require('views/articleList');

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
			}
		}
	},
	article: {
		download: {
			title: bg.lang.c.DOWNLOAD,
			icon: 'save.png',
			fn: function() {
				if (!itemView.model) return;
				var tpl = _.template($('#template-download').html());
				var attrs = Object.create(itemView.model.attributes);
				attrs.date = itemView.getFormatedDate(attrs.date);
				var blob = new Blob([ tpl(attrs) ], { type: 'text\/html' });
				var url = URL.createObjectURL(blob);
				window.open(url);
				setTimeout(function() {
					URL.revokeObjectURL(url);	
				}, 30000);
			}
		},
		print: {
			title: bg.lang.c.PRINT,
			icon: 'print.png',
			fn: function() {
				if (!itemView.model) return;
				window.print();
			}
		},
		mark: {
			title: bg.lang.c.MARK_AS_READ,
			icon: 'read.png',
			fn: function() {
				if (!itemView.model) return;
				itemView.model.save({
					unread: !itemView.model.get('unread'),
					visited: true
				});
			}
		},
		delete: {
			title: bg.lang.c.DELETE,
			icon: 'delete.png',
			fn: function(e) {
				if (!itemView.model) return;
				if (e.shiftKey) {
					itemView.model.markAsDeleted();
				} else {
					itemView.model.save({
						trashed: true,
						visited: true
					});
				}
			}
		},
		showConfig: {
			title: bg.lang.c.SETTINGS,
			icon: 'config.png',
			fn: function() {
				app.article.overlay.show();
			}
		}
	}
});