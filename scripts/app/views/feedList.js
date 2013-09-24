define([
	'backbone', 'jquery', 'views/SourceView', 'views/FolderView', 'views/SpecialView', 'models/Special',
	'instances/contextMenus', 'mixins/selectable', 'instances/specials'
],
function (BB, $, SourceView, FolderView, SpecialView, Special, contextMenus, selectable, specials) {

	var FeedListView = BB.View.extend({
		//el: '#list',
		tagName: 'div',
		itemClass: 'list-item',
		id: 'feed-list',
		events: {
			'dragstart .source':     'handleDragStart',
			'drop':                  'handleDrop',
			'drop [data-in-folder]': 'handleDrop',
			'drop .folder':          'handleDrop',
			'dragover':              'handleDragOver',
			'dragover .folder,[data-in-folder]':  'handleDragOver',
			'dragleave .folder,[data-in-folder]': 'handleDragLeave',
			'mousedown .list-item': 'handleMouseDown',
			'mouseup .list-item': 'handleMouseUp'
		},
		initialize: function() {

			this.el.view = this;

			this.on('attach', this.handleAttach);

			bg.sources.on('reset', this.addSources, this);
			bg.sources.on('add', this.addSource, this);
			bg.sources.on('change:folderID', this.handleChangeFolder, this);
			bg.folders.on('add', this.addFolder, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);

			this.on('pick', this.handlePick);
			
		},
		handleAttach: function() {
			app.on('select-all-feeds', function() {
				var allFeeds = $('.special:first').get(0);
				if (!allFeeds) return;
				this.select(allFeeds.view);
			}, this);

			app.on('select-folder', function(id) {
				var folder = $('.folder[data-id=' + id + ']').get(0);
				if (!folder) return;
				this.select(folder.view);
			}, this);

			this.insertFeeds();
		},
		insertFeeds: function() {
			this.addFolders(bg.folders);

			this.addSpecial(specials.allFeeds);
			this.addSpecial(specials.pinned);
			this.addSpecial(specials.trash);

			this.addSources(bg.sources);

			return this;
		},
		/**
		 * If one list-item was selected by left mouse button, show its articles.
		 * Triggered by selectable mixin.
		 * @method handlePick
		 * @param view {TopView} Picked source, folder or special
		 * @param event {Event} Mouse or key event
		 */
		handlePick: function(view, e) {
			if (e.type == 'mousedown' && e.which == 1) {
				view.showSourceItems(e);
				
				// to prevent setting focus back to feedList
				setTimeout(function(e) {
					app.actions.execute('articles:focus');
				}), 0;

			}
		},
		handleMouseDown: function(e) {
			//e.currentTarget.view.handleMouseDown(e);
			this.handleSelectableMouseDown(e);
		},
		handleMouseUp: function(e) {
			e.currentTarget.view.handleMouseUp(e);
			this.handleSelectableMouseUp(e);
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

			var folderID;
			if ($(e.currentTarget).hasClass('folder')) {
				folderID = e.currentTarget.dataset.id;
			} else {
				folderID = e.currentTarget.dataset.inFolder;
			}

			item.save({ folderID: folderID });

			e.stopPropagation();
		},
		handleDragStart: function(e) {
			var id = e.currentTarget.view.model.get('id');

			e.originalEvent.dataTransfer.setData('dnd-sources', id);
		},
		handleChangeFolder: function(source) {
			source = $('.source[data-id=' + source.get('id') + ']').get(0);
			if (!source) return;

			this.placeSource(source.view);
		},
		handleClearEvents: function(id) {
			if (window == null || id == tabID) {
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
			var that = this;
			$('.folder').each(function(i, folder) {
				if (!folder.view || !(folder instanceof FolderView)) return;
				that.destroySource(folder.view);
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
					view.$el.addClass('invisible');
				}

				return;
			}


			var fls;
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
			var that = this;
			$('.source').each(function(i, source) {
				if (!source.view || !(source instanceof SourceView)) return;
				that.destroySource(source.view);
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
		},
		getSelectedFeeds: function(arr) {
			var si = arr || _.pluck(this.selectedItems, 'model');
			var rt = [];
			for (var i=0; i<si.length; i++) {
				if (si[i] instanceof bg.Source) {
					rt.push(si[i]);
				} else if (si[i] instanceof bg.Folder) {
					var folderFeeds = bg.sources.where({ folderID: si[i].id });
					rt.push.apply(rt, this.getSelectedFeeds(folderFeeds));
				}
			}

			return _.unique(rt);
		}
	});

	FeedListView = FeedListView.extend(selectable);

	return new FeedListView();
});