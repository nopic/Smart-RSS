define({
	global: {
		default: function() {
			alert('no action');
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

	},
	article: {

	}
});