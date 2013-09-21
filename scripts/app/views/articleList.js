define([
	'backbone', 'underscore', 'jquery', 'collections/Groups', 'models/Group', 'views/GroupView',
	'views/ItemView', 'mixins/selectable'
],
function (BB, _, $, Groups, Group, GroupView, ItemView, selectable) {

	function isScrolledIntoView(elem) {
		if (!screen) {
			bg.sources.trigger('clear-events', -1);
			return false;
		}
		
		var docViewTop = 0;
		var docViewBottom = screen.height;

		var rect = elem.getBoundingClientRect();
		var elemTop = rect.top;
		var elemBottom = elemTop + rect.height;

		return (elemBottom >= docViewTop) && (elemTop <= docViewBottom);
		/*  && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) ;*/
	}

	

	var groups = new Groups();

	var ArticleListView = BB.View.extend({
		_itemHeight: 0,
		tagName: 'div',
		id: 'article-list',
		itemClass: 'item',
		views: [],
		viewsToRender: [],
		currentSource: null,
		currentFolder: null,
		specialName: 'all-feeds',
		specialFilter: { trashed: false },
		unreadOnly: false,
		noFocus: false,
		reuseIndex: 0,
		events: {
			'dragstart .item': 'handleDragStart',
			'mousedown .item': 'handleMouseDown',
			'dblclick .item': 'handleItemDblClick',
			'mouseup .item': 'handleMouseUp',
			'mousedown .item-pin,.item-pinned': 'handleClickPin',
		},
		handleItemDblClick: function() {
			app.actions.execute('articles:oneFullArticle');
		},
		handleClickPin: function(e) {
			e.currentTarget.parentNode.view.handleClickPin(e);
		},
		handleMouseDown: function(e) {
			e.currentTarget.view.handleMouseDown(e);
		},
		handleMouseUp: function(e) {
			e.currentTarget.view.handleMouseUp(e);
		},
		initialize: function() {

			this.$el.addClass('lines-' + bg.settings.get('lines'));
			bg.items.on('reset', this.addItems, this);
			bg.items.on('add', this.addItem, this);
			bg.items.on('sort', this.handleSort, this);
			bg.items.on('render-screen', this.handleRenderScreen, this);
			bg.settings.on('change:lines', this.handleChangeLines, this);
			bg.settings.on('change:layout', this.handleChangeLayout, this);
			bg.sources.on('destroy', this.handleSourcesDestroy, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);

			groups.on('add', this.addGroup, this);

			/****window.addEventListener('load', function() {
				window.focus();
			});****/

			this.on('attach', this.handleAttached, this);
			this.on('pick', this.handlePick, this);


			

			/****Why this.el.addEventListener doesn't work? ****/
			this.$el.on('scroll', this.handleScroll.bind(this));

		},
		handlePick: function(view) {
			if (view.model.get('unread') && bg.settings.get('readOnVisit')) {
				view.model.save({
					visited: true,
					unread: false
				});
			} else if (!view.model.get('visited')) {
				view.model.save('visited', true);
			}
		},
		handleAttached: function() {

			app.on('select:feed-list', function(data) {
				if (data.action == 'new-select' || data.action == 'new-folder-select') {
					if (!data.noFocus) window.focus();
					this.el.scrollTop = 0;
					this.unreadOnly = data.unreadOnly;
				}

				if (data.action == 'new-select') {
					if (typeof data.value == 'object') {
						this.handleNewSpecialSelected(data.value, data.name);
					} else {
						this.handleNewSelected(bg.sources.findWhere({ id: data.value }));
					}
				} else if (data.action == 'new-folder-select') {
					this.handleNewFolderSelected(data.value);
				}
			}, this);

			app.on('give-me-next', function() {
				if (this.selectedItems[0] && this.selectedItems[0].model.get('unread') == true) {
					this.selectedItems[0].model.save({ unread: false });
				}
				this.selectNext({ selectUnread: true });
			}, this);

			this.loadAllFeeds();
		},
		loadAllFeeds: function() {
			var that = this;
			setTimeout(function() {
				var unread = bg.items.where({ trashed: false, unread: true });
				if (unread.length) {
					that.addItems(unread);
				} else {
					that.addItems(bg.items.where({ trashed: false }));
				}
			}, 0);

			return this;
		},
		handleRenderScreen: function() {
			this.handleScroll();
		},
		handleScroll: function() {
			var start = -1;
			var count = 0;
			for (var i=0,j=this.viewsToRender.length; i<j; i++) {
				if ((start >= 0 && count % 10 != 0) || isScrolledIntoView(this.viewsToRender[i].el)) {
					this.viewsToRender[i].render();
					count++;
					if (start == -1) start = i;
				} else if (start >= 0) {
					break;
				}
			}


			if (start >= 0 && count > 0) {
				this.viewsToRender.splice(start, count);
			}
		},
		handleClearEvents: function(id) {
			if (window == null || id == tabID) {
				bg.items.off('reset', this.addItems, this);
				bg.items.off('add', this.addItem, this);
				bg.items.off('sort', this.handleSort, this);
				bg.items.off('render-screen', this.handleRenderScreen, this);
				bg.settings.off('change:lines', this.handleChangeLines, this);
				bg.settings.off('change:layout', this.handleChangeLayout, this);
				bg.sources.off('destroy', this.handleSourcesDestroy, this);
				if (this.currentSource) {
					this.currentSource.off('destroy', this.handleDestroyedSource, this);
				}
				if (this.currentFolder) {
					this.currentFolder.off('destroy', this.handleDestroyedSource, this);
				}
				bg.sources.off('clear-events', this.handleClearEvents, this);
			}
		},
		handleChangeLayout: function() {
			var that = this;
			requestAnimationFrame(function() {
				that.setItemHeight();
				that.handleScroll();
			});
		},
		handleSort: function() {
			$('#input-search').val('');
			if (this.specialName) {
				this.handleNewSpecialSelected(this.specialFilter, this.specialName);
			} else if (this.currentSource) {
				this.handleNewSelected(this.currentSource);
			} else if (this.currentFolder) {
				this.handleNewFolderSelected(this.currentFolder);
			} else {
				alert('E1: This should not happen. Please report it!');
			}
		},
		handleChangeLines: function(settings) {
			this.$el.removeClass('lines-auto');
			this.$el.removeClass('lines-one-line');
			this.$el.removeClass('lines-two-lines');
			// this.$el.removeClass('lines-' + settings.previous('lines')); // does not work for some reason
			this.$el.addClass('lines-' + settings.get('lines'));
		},
		handleDragStart: function(e) {
			var ids = this.selectedItems.map(function(view) {
				return view.model.id;
			});

			e.originalEvent.dataTransfer.setData('text/plain', JSON.stringify(ids));
		},
		selectAfterDelete: function(view) {
			if (view == this.selectedItems[0]) {
				var last = $('.item:not(.invisible):last').get(0);
				if (last && view == last.view) {
					this.selectPrev({ currentIsRemoved: true });
				} else {
					this.selectNext({ currentIsRemoved: true });
				}
			} else {
				// if first item is the last item to be deleted, selecting it will trigger error - rAF to get around it
				requestAnimationFrame(function() {
					this.selectFirst();
				}.bind(this));
			}
		},
		addItem: function(item, noManualSort) {
			/**
			 * Don't add newly fetched items to middle column, when they shouldn't be
			 */
			if (noManualSort !== true) {
				if (this.currentSource && this.currentSource.id != item.get('sourceID')) {
					return;
				} else if (this.specialName && this.specialName != 'all-feeds') {
					return;
				} else if (this.currentFolder && this.currentFolder.id != item.getSource().get('folderID')) {
					return;
				}
			}

			if (!item.get('deleted') && (!item.get('trashed') || this.specialName == 'trash') ) {

				var after = null;
				if (noManualSort !== true) {
					$.makeArray($('#list .item, #list .date-group')).some(function(itemEl) {
						if (bg.items.comparator(itemEl.view.model, item) === 1) {
							after = itemEl;
							return true;
						}
					});
				}

				var view;

				if (!after) {
					if (this.reuseIndex >= this.views.length) {
						view = new ItemView({ model: item }, this);
						if (!this._itemHeight) {
							view.render();
						} else {
							view.$el.css('height', this._itemHeight + 'px');
							view.prerender();
						}
						this.$el.append(view.$el);
						this.views.push(view);
					} else {
						view = this.views[this.reuseIndex];
						view.swapModel(item);
					}
					
					if (!this.selectedItems.length) this.select(view);
				} else {
					view = new ItemView({ model: item }, this);
					view.render().$el.insertBefore($(after));
					
					// weee, this is definitelly not working 100% right :D or is it?
					var indexElement = after.view instanceof ItemView ? after : after.nextElementSibling;
					var index = indexElement ? this.views.indexOf(indexElement.view) : -1;
					if (index == -1) index = this.reuseIndex;

					this.views.splice(index, 0, view);
				}

				if (!this._itemHeight) {
					this._itemHeight = view.el.getBoundingClientRect().height;
				}


				if (!bg.settings.get('disableDateGroups')) {
					var group = Group.getGroup(item.get('date'));
					if (!groups.findWhere({ title: group.title })) {
						groups.add(new Group(group), { before: view.el });
					}
				}

				this.reuseIndex++;
				

				
			}
		},
		addGroup: function(model, col, opt) {
			var before = opt.before;
			var view = new GroupView({ model: model }, groups);
			
		
			view.render().$el.insertBefore(before);
		},
		setItemHeight: function() {
			var firstItem = $('.item:not(.invisible):first');
			if (firstItem.length) {
				this._itemHeight = firstItem.get(0).getBoundingClientRect().height;
			}
		},
		addItems: function(items) {

			groups.reset();
			

			/**
			 * Select removal
			 */
			this.selectedItems = [];
			this.viewsToRender = [];
			$('.selected').removeClass('.selected');
			$('.last-selected').removeClass('.last-selected');
			this.selectPivot = null;
			/* --- */

			//var st = Date.now();

			this.setItemHeight();

			this.reuseIndex = 0;

			

			items.forEach(function(item) {
				this.addItem(item, true);
			}, this);

			for (var i=this.reuseIndex, j = this.views.length; i < j; i++) {
				if (!this.views[i].model) break;
				this.views[i].unplugModel();
			}

			this.handleScroll();

			//alert(Date.now() - st);

		},
		clearOnSelect: function() {
			$('#input-search').val('');

			if (this.currentSource) {
				this.currentSource.off('destroy', this.handleDestroyedSource, this);
			}

			if (this.specialName == 'trash') {
				$('[data-action="articles:update"]').css('display', 'block');
				$('[data-action="articles:undelete"]').css('display', 'none');
				$('#context-undelete').css('display', 'none');
			}

			if (this.currentFolder) {
				this.currentFolder.off('destroy', this.handleDestroyedSource, this);
			}

			this.specialName = null;
			this.specialFilter = null;
			this.currentSource = null;
			this.currentFolder = null;
		},
		handleNewSelected: function(source) {
			this.clearOnSelect();
			this.currentSource = source;
			
			source.on('destroy', this.handleDestroyedSource, this);

			var completeFilter = { sourceID: source.id };
			if (this.unreadOnly) completeFilter.unread = true;
			this.addItems( bg.items.where(completeFilter) );
		},
		handleNewSpecialSelected: function(filter, name) {
			this.clearOnSelect();

			this.specialName = name;
			this.specialFilter = filter;

			if (this.specialName == 'trash') {
				$('[data-action="articles:update"]').css('display', 'none');
				$('[data-action="articles:undelete"]').css('display', 'block');
				$('#context-undelete').css('display', 'block');
			}
			var completeFilter = filter;
			if (this.unreadOnly) completeFilter.unread = true;
			this.addItems( bg.items.where(completeFilter) );
		},
		handleNewFolderSelected: function(folderID) {
			this.clearOnSelect();

			if (folderID instanceof bg.Folder) {
				this.currentFolder = folderID;
				folderID = this.currentFolder.get('id');
			} else {
				this.currentFolder = bg.folders.findWhere({ id: folderID });
			}

			
			this.currentFolder.on('destroy', this.handleDestroyedSource, this);



			var feeds = _.pluck(bg.sources.where({ folderID: folderID }), 'id');

			if (!feeds.length) return;

			this.addItems( bg.items.filter(function(item) {
				if (this.unreadOnly && item.get('unread') == true) {
					if (feeds.indexOf(item.get('sourceID')) >= 0) {
						return true;
					}
				} else if (!this.unreadOnly && feeds.indexOf(item.get('sourceID')) >= 0) {
					return true;
				}
				
			}, this) );
		},
		/**
		 * @Triggered: when any source is destroyed
		 * @Description: if source in current folder is deleted select current folder
		 */
		handleSourcesDestroy: function(source) {
			if (!this.currentFolder) return;
			var folderID = source.get('folderID');
			if (folderID && this.currentFolder.id == folderID) {
				app.trigger('select-folder', this.currentFolder.id);
			}
		},
		/**
		 * Triggered: when currently selected feed or folder is destroyed
		 */
		handleDestroyedSource: function(model) {
			var that = this;
			if (this.currentFolder && !(model instanceof bg.Folder)) {
				alert('U01: This should never happen. If it did, please note what you just did it and contact me :)');
				/*setTimeout(function() {
					topWindow.frames[0].postMessage({ action: 'select-folder', value: this.currentFolder.id }, '*');
					that.handleNewFolderSelected(that.currentFolder);
				}, 0);*/
			} else {
				// select all feeds in left column
				if (model == this.currentSource) {
					app.trigger('select-all-feeds');
					//topWindow.frames[0].postMessage({ action: 'select-all-feeds' }, '*');
				}

				// load all feeds in middle column
				this.clearOnSelect();
				this.specialName = 'all-feeds';
				if (document.querySelector('.item')) {
					this.once('items-destroyed', function() {
						that.loadAllFeeds();
					}, this);
				} else {
					this.loadAllFeeds();
				}
				
			}
		},
		undeleteItem: function(view) {
			view.model.save({
				'trashed': false
			});
			this.destroyItem(view);
		},
		removeItem: function(view) {
			view.model.save({ trashed: true, visited: true });
			//this.destroyItem(view);
		},
		removeItemCompletely: function(view) {
			if (view.model.get('pinned')) {
				var conf = confirm(bg.lang.c.PIN_QUESTION_A + view.model.escape('title') + bg.lang.c.PIN_QUESTION_B);
				if (!conf) {
					return;
				}
			}
			view.model.markAsDeleted();
			//this.destroyItem(view);
		},
		destroyBatch: function(arr, fn) {
			for (var i=0, j=arr.length; i<j; i++) {
				fn.call(this, arr[i]);
			}
		},
		nextFrameStore: [],
		nextFrame: null,
		destroyItem: function(view) {
			this.nextFrameStore.push(view);
			if (!this.nextFrame) {
				this.nextFrame = requestAnimationFrame(function() {
					for (var i=0, j=this.nextFrameStore.length - 1; i<j; i++) {
						this.destroyItemFrame(this.nextFrameStore[i]);
					}
					var lastView = this.nextFrameStore[this.nextFrameStore.length - 1];
					this.selectAfterDelete(lastView);
					this.destroyItemFrame(lastView);

					this.nextFrame = null;
					this.nextFrameStore = [];
					this.handleScroll();

					this.trigger('items-destroyed');

				}.bind(this));
			}
		},
		destroyItemFrame: function(view) {
			// START: REMOVE DATE GROUP
			/*var prev = view.el.previousElementSibling;
			var next = view.el.nextElementSibling;*/
			var prev = view.el.findPrev(':not(.unpluged)');
			var next = view.el.findNext(':not(.unpluged)');
			if (prev && prev.classList.contains('date-group')) {
				if (!next || next.classList.contains('date-group')) {
					groups.remove(prev.view.model);
				}
			}
			// END: REMOVE DATE GROUP

			view.clearEvents();
			// view.undelegateEvents(); - I moved all events to _list_ so this shouldn't be neccesary
			// view.$el.removeData() - i removed this as I don't use jquery .data, if I will in future I have to add it again
			// view.$el.unbind(); - - I'm not adding any jquery events
			// view.off(); - This takes from some reason quite a time, and does nothing because I'm not adding events on the view
			view.remove();
			
			var io = this.selectedItems.indexOf(view);
			if (io >= 0) this.selectedItems.splice(io, 1);
			io = this.views.indexOf(view);
			if (io >= 0) this.views.splice(io, 1);
			io = this.viewsToRender.indexOf(view);
			if (io >= 0) this.viewsToRender.splice(io, 1);

			// not really sure what would happen if this wouldn't be here :P (too tired to think about it)
			this.reuseIndex--;
			if (this.reuseIndex < 0) {
				this.reuseIndex = 0;
				console.log('reuse index under zero');
			}
		},
		changeUnreadState: function(opt) {
			opt = opt || {};
			var val = this.selectedItems.length && !opt.onlyToRead ? !this.selectedItems[0].model.get('unread') : false;
			this.selectedItems.forEach(function(item) {
				if (!opt.onlyToRead || item.model.get('unread') == true) {
					item.model.save({ unread: val, visited: true });
				}
				
			}, this);
		}
	});

	ArticleListView = ArticleListView.extend(selectable);

	return new ArticleListView();
});