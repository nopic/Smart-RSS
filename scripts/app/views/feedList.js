define(['marionette', 'views/SourceView', 'views/FolderView', 'views/SpecialView', 'models/Special', 'instances/contextMenus'], 	
function (Marionette, SourceView, FolderView, SpecialView, Special, contextMenus) {


	var trash = new Special({
		title: bg.lang.c.TRASH,
		icon: 'trashsource.png',
		filter: { trashed: true, deleted: false },
		position: 'bottom',
		name: 'trash',
		onReady: function() {
			this.contextMenu = contextMenus.get('trash');
			this.el.addEventListener('dragover', function(e) {
				e.preventDefault();
			});
			this.el.addEventListener('drop', function(e) {
				e.preventDefault();
				var ids = JSON.parse(e.dataTransfer.getData('text/plain') || '[]') || [];
				ids.forEach(function(id) {
					var item = bg.items.findWhere({ id: id });
					if (item && !item.get('trashed')) {
						item.save({
							trashed: true
						});
					}
				});
			});
		}
	});

	var FeedListView = Marionette.CollectionView.extend({
		//el: '#list',
		tagName: 'div',
		id: 'feed-list',
		selectedItems: [],
		events: {
			'dragstart .source':     'handleDragStart',
			'drop':                  'handleDrop',
			'drop [data-in-folder]': 'handleDrop',
			'drop .folder':          'handleDrop',
			'dragover':              'handleDragOver',
			'dragover .folder,[data-in-folder]':  'handleDragOver',
			'dragleave .folder,[data-in-folder]': 'handleDragLeave'
		},
		initialize: function() {

			this.el.view = this;

			

			bg.sources.on('reset', this.addSources, this);
			bg.sources.on('add', this.addSource, this);
			bg.sources.on('change:folderID', this.handleChangeFolder, this);
			bg.folders.on('add', this.addFolder, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);

			//window.addEventListener('message', this.handleMessage);
			
		},
		attach: function() {
			app.on('start', this.insertFeeds, this);
			return this;
		},
		insertFeeds: function() {
			this.addFolders(bg.folders);

			this.addSpecial(new Special({
				title: bg.lang.c.ALL_FEEDS,
				icon: 'icon16_v2.png',
				filter: { trashed: false },
				position: 'top',
				name: 'all-feeds',
				onReady: function() {
					this.contextMenu = contextMenus.get('allFeeds');
				}
			}));

			this.addSpecial(new Special({
				title: bg.lang.c.PINNED,
				icon: 'pinsource.png',
				filter: { trashed: false, pinned: true },
				position: 'bottom',
				name: 'pinned'
			}));

			this.addSpecial(trash);

			this.addSources(bg.sources);

			return this;
		},
		handleMessage: function(e) {
			if (e.data.action == 'select-folder') {
				var folder = $('.folder[data-id=' + e.data.value + ']').get(0);
				if (!folder) return;
				folder.view.select();
			} else if (e.data.action == 'select-all-feeds') {
				var allFeeds = $('.special:first').get(0);
				if (!allFeeds) return;
				allFeeds.view.select();
			}
		},
		handleDragOver: function(e) {
			var f = e.currentTarget.dataset.inFolder;
			if (f) {
				$('.folder[data-id=' + f + ']').addClass('drag-over');
			} else if ($(e.currentTarget).hasClass('folder')) {
				$(e.currentTarget).addClass('drag-over');
			}
			e.preventDefault();
		},
		handleDragLeave: function(e) {
			var f = e.currentTarget.dataset.inFolder;
			if (f) {
				$('.folder[data-id=' + f + ']').removeClass('drag-over');
			} else if ($(e.currentTarget).hasClass('folder')) {
				$(e.currentTarget).removeClass('drag-over');
			}
		},
		handleDrop: function(e) {
			var oe = e.originalEvent;
			e.preventDefault();

			$('.drag-over').removeClass('drag-over');

			var id = oe.dataTransfer.getData('dnd-sources');
			if (!id) return;

			var item = bg.sources.findWhere({ id: id });
			if (!item) return;

			if ($(e.currentTarget).hasClass('folder')) {
				var folderID = e.currentTarget.dataset.id;
			} else {
				var folderID = e.currentTarget.dataset.inFolder;	
			}

			item.save({ folderID: folderID });

			e.stopPropagation();
		},
		handleDragStart: function(e) {
			var id = e.currentTarget.view.model.get('id');

			e.originalEvent.dataTransfer.setData('dnd-sources', id);
		},
		handleChangeFolder: function(source) {
			var source = $('.source[data-id=' + source.get('id') + ']').get(0);
			if (!source) return;

			this.placeSource(source.view)
		},
		handleClearEvents: function(id) {
			if (window == null || id == window.top.tabID) {
				bg.sources.off('reset', this.addSources, this);
				bg.sources.off('add', this.addSource, this);
				bg.sources.off('change:folderID', this.handleChangeFolder, this);
				bg.folders.off('add', this.addFolder, this);
				bg.sources.off('clear-events', this.handleClearEvents, this);
			}
		},
		addSpecial: function(special) {

			var view = new SpecialView({ model: special });
			if (view.model.get('position') == 'top') {
				this.$el.prepend(view.render().el);
			} else {
				this.$el.append(view.render().el);
			}
			
		},
		addFolder: function(folder) {
			var view = new FolderView({ model: folder }, this);
			var folderViews = $('.folder').toArray();
			if (folderViews.length) {
				this.insertBefore(view.render(), folderViews);
			} else if ($('.special:first').length) {
				// .special-first = all feeds, with more "top" specials this will have to be changed
				view.render().$el.insertAfter($('.special:first'));
			} else {
				this.$el.append(view.render().$el);
			}
		},
		addFolders: function(folders) {
			$('.folder').each(function(i, folder) {
				if (!folder.view || !(folder instanceof FolderView)) return;
				list.destroySource(folder.view);
			});
			folders.forEach(function(folder) {
				this.addFolder(folder);
			}, this);
		},
		addSource: function(source, noManualSort) {
			var view = new SourceView({ model: source }, this);
			this.placeSource(view, noManualSort === true ? true : false);
		},
		placeSource: function(view, noManualSort) {
			var folder = null;
			var source = view.model;
			if (source.get('folderID')) {
				folder = $('.folder[data-id=' + source.get('folderID') + ']');
				if (!folder.length) folder = null;
			}
			
			var sourceViews;
				
			if (folder) {
				sourceViews = $('.source[data-in-folder=' + source.get('folderID') + ']').toArray();
				if (sourceViews.length && noManualSort) {
					view.render().$el.insertAfter(sourceViews.last());
				} else if (sourceViews.length) {
					this.insertBefore(view.render(), sourceViews);
				} else {
					view.render().$el.insertAfter(folder);	
				}

				if (!folder.get(0).view.model.get('opened')) {
					view.$el.addClass('in-closed-folder');
				}

				return;
			}



			sourceViews = $('.source:not([data-in-folder])').toArray();
			if (sourceViews.length && noManualSort) {
				view.render().$el.insertAfter(sourceViews.last());
			} else if (sourceViews.length) {
				this.insertBefore(view.render(), sourceViews);
			} else if ((fls = $('[data-in-folder],.folder')).length) {
				view.render().$el.insertAfter(fls.last());
			} else if ($('.special:first').length) {
				// .special-first = all feeds, with more "top" specials this will have to be changed
				view.render().$el.insertAfter($('.special:first'));
			} else {
				this.$el.append(view.render().$el);
			}
		},
		insertBefore: function(what, where){
			var before = null;
			where.some(function(el) {
				if (el.view.model != what.model && bg.sources.comparator(el.view.model, what.model) == 1) {
					return before = el;
				}
			});
			if (before) {
				what.$el.insertBefore(before);	
			} else {
				if (what instanceof FolderView) {
					var folderSources = $('[data-in-folder=' + where.last().view.model.get('id') + ']');
					if (folderSources.length) {

						where.last(folderSources.last());	
					}
				} 
				what.$el.insertAfter(where.last());
			}
		},
		addSources: function(sources) {
			$('.source').each(function(i, source) {
				if (!source.view || !(source instanceof SourceView)) return;
				list.destroySource(source.view);
			});
			sources.forEach(function(source) {
				this.addSource(source, true);
			}, this);
		},	
		removeSource: function(view) {
			view.model.destroy();
		},
		destroySource: function(view) {
			view.clearEvents();
			view.undelegateEvents();
			view.$el.removeData().unbind(); 
			view.off();
			view.remove();
			var io = this.selectedItems.indexOf(view);
			if (io >= 0) {
				this.selectedItems.splice(io, 1);
			}
		}
	});

	return new FeedListView();
});