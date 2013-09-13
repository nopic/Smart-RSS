define(['backbone', 'views/ContextMenu'], function(BB, ContextMenu) {
	var sourcesContextMenu = new ContextMenu([
		{
			title: bg.lang.c.UPDATE,
			icon: 'reload.png',
			action: function() {
				bg.downloadOne(sourcesContextMenu.currentSource);
			}
		},
		{ 
			title: bg.lang.c.MARK_ALL_AS_READ,
			icon: 'read.png',
			action: function() { 
				if (!sourcesContextMenu.currentSource) return;
				var id = sourcesContextMenu.currentSource.get('id');
				bg.items.forEach(function(item) {
					if (item.get('unread') == true && item.getSource().id == id) {
						item.save({
							unread: false,
							visited: true
						});
					}
				});

				sourcesContextMenu.currentSource.save({ hasNew: false });
			}
		},
		{ 
			title: bg.lang.c.DELETE,
			icon: 'delete.png',
			action: function() { 
				if (confirm(bg.lang.c.REALLY_DELETE)) {
					sourcesContextMenu.currentSource.destroy();	
				}
				
			}
		},
		{ 
			title: bg.lang.c.PROPERTIES,
			icon: 'properties.png',
			action: function() {
				properties.show(sourcesContextMenu.currentSource);
				properties.currentSource = sourcesContextMenu.currentSource;
			}
		}
	]);

	var trashContextMenu = new ContextMenu([
		{ 
			title: bg.lang.c.MARK_ALL_AS_READ,
			icon: 'read.png',
			action: function() { 
				bg.items.where({ trashed: true, deleted: false }).forEach(function(item) {
					if (item.get('unread') == true) {
						item.save({
							unread: false,
							visited: true
						});
					}
				});
			}
		},
		{ 
			title: bg.lang.c.EMPTY_TRASH,
			icon: 'delete.png',
			action: function() { 
				if (confirm(bg.lang.c.REALLY_EMPTY_TRASH)) {
					bg.items.where({ trashed: true, deleted: false }).forEach(function(item) {
						item.markAsDeleted();
					});
				}
			}
		}
	]);

	var allFeedsContextMenu = new ContextMenu([
		{
			title: bg.lang.c.UPDATE_ALL,
			icon: 'reload.png',
			action: function() {
				bg.downloadAll(true);
			}
		},
		{ 
			title: bg.lang.c.MARK_ALL_AS_READ,
			icon: 'read.png',
			action: function() { 
				if (confirm(bg.lang.c.MARK_ALL_QUESTION)) {
					bg.items.forEach(function(item) {
						item.save({ unread: false, visited: true });
					});	
				}
			}
		},
		{ 
			title: bg.lang.c.DELETE_ALL_ARTICLES,
			icon: 'delete.png',
			action: function() { 
				if (confirm(bg.lang.c.DELETE_ALL_Q)) {
					bg.items.forEach(function(item) {
						if (item.get('deleted') == true) return;
						item.markAsDeleted();
					});
				}
			}
		}
	]);

	var folderContextMenu = new ContextMenu([
		{
			title: bg.lang.c.UPDATE,
			icon: 'reload.png',
			action: function() {
				var folder = list.selectedItems[0].model;
				if (!folder || !(folder instanceof bg.Folder)) return;

				bg.sources.forEach(function(source) {
					if (source.get('folderID') == folder.id) {
						bg.downloadOne(source);	
					}
				});
				bg.downloadOne(sourcesContextMenu.currentSource);
			}
		},
		{ 
			title: bg.lang.c.MARK_ALL_AS_READ,
			icon: 'read.png',
			action: function() { 
				var folder = list.selectedItems[0].model;
				if (!folder || !(folder instanceof bg.Folder)) return;

				var sources = bg.sources.where({ folderID: folder.get('id') });
				if (!sources.length) return;

				for (var i=0; i<sources.length; i++) {
					bg.items.forEach(function(item) {
						if (item.get('unread') == true && item.getSource() == sources[i]) {
							item.save({
								unread: false,
								visited: true
							});
						}
					});
					sources[i].save({ hasNew: false });
				}
			}
		},
		{ 
			title: bg.lang.c.DELETE,
			icon: 'delete.png',
			action: function() { 
				if (!confirm(bg.lang.c.REALLY_DELETE)) return;

				var folder = list.selectedItems[0].model;
				bg.sources.where({ folderID: folder.get('id') }).forEach(function(item) {
					item.destroy();
				});
				folder.destroy();
			}
		},
		{ 
			title: bg.lang.c.RENAME,
			action: function() { 
				var newTitle = prompt(bg.lang.c.FOLDER_NAME + ': ', list.selectedItems[0].model.get('title'));
				if (!newTitle) return;

				list.selectedItems[0].model.save({ title: newTitle });
			}
		}
	]);

	var contextMenus = new (BB.View.extend({
		list: {},
		initialize: function() {
			this.list = {
				sources:  sourcesContextMenu, 
				trash:    trashContextMenu, 
				folder:   folderContextMenu, 
				allFeeds: allFeedsContextMenu
			};
		},
		get: function(name) {
			if (name in this.list)  {
				return this.list[name];
			}
			return null;
		},
		hideAll: function() {
			Object.keys(this.list).forEach(function(item) {
				this.list[item].hide();
			}, this);
		}
	}));

	return contextMenus;
});