define(['backbone', 'helpers/formatDate'], function(BB, formatDate) {
	var ItemView = BB.View.extend({
		tagName: 'div',
		className: 'item',
		template: _.template($('#template-item').html()),
		initialize: function() {
			this.el.setAttribute('draggable', 'true');
			this.el.view = this;
			this.setEvents();
		},
		setEvents: function() {
			this.model.on('change', this.handleModelChange, this);
			this.model.on('destroy', this.handleModelDestroy, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);
		},
		swapModel: function(newModel) {
			if (this.model == newModel) {
				this.prerender();
				return;
			}
			if (this.model) {
				this.clearEvents();
			}
			this.model = newModel;
			this.setEvents();
			this.prerender();
		},
		prerendered: false,
		prerender: function() {
			prerendered = true;
			app.articleList.viewsToRender.push(this);
			this.el.className = this.model.get('unread') ? 'item unread' : 'item';
		},
		unplugModel: function() {
			if (this.model) {
				this.el.className = 'unpluged';
				this.clearEvents();
				this.model = null;
				this.el.innerHTML = '';
				if (_itemHeight) this.$el.css('height', _itemHeight + 'px');
			}
		},
		handleClearEvents: function(id) {
			if (window == null || id == window.top.tabID) {
				this.clearEvents();
			} 
		},
		clearEvents: function() {
			if (this.model) {
				this.model.off('change', this.handleModelChange, this);
				this.model.off('destroy', this.handleModelDestroy, this);
			}
			bg.sources.off('clear-events', this.handleClearEvents, this);
		},
		render: function() {

			this.$el.toggleClass('unvisited', !this.model.get('visited'));
			this.$el.toggleClass('unread', this.model.get('unread'));

			var ca = this.model.changedAttributes();
			if (ca) {
				var caKeys =  Object.keys(ca);
				if ( ('unread' in ca && caKeys.length == 1) || ('unread' in ca && 'visited' in ca && caKeys.length == 2) ) {
					return this;
				}
			}

			this.$el.css('height','');
			var data = this.model.toJSON();

			var dateFormats = { normal: 'DD.MM.YYYY', iso: 'YYYY-MM-DD', us: 'MM/DD/YYYY' };
			var pickedFormat = dateFormats[bg.settings.get('dateType') || 'normal'] || dateFormats['normal'];

			var timeFormat = bg.settings.get('hoursFormat') == '12h' ? 'H:mm a' : 'hh:mm';
			var timeFormatTitle = bg.settings.get('hoursFormat') == '12h' ? 'H:mm a' : 'hh:mm:ss';

			if (data.date) {
				if (bg.settings.get('fullDate')) {
					data.date = formatDate(new Date(data.date), pickedFormat + ' ' + timeFormat);
				} else if (parseInt(formatDate(data.date, 'T') / 86400000) >= parseInt(formatDate(Date.now(), 'T') / 86400000)) {
					data.date = formatDate(new Date(data.date), timeFormat);
				} else if ((new Date(data.date)).getFullYear() == (new Date()).getFullYear() ) {
					data.date = formatDate(new Date(data.date), pickedFormat.replace(/\/?YYYY(?!-)/, ''));	
				} else {
					data.date = formatDate(new Date(data.date), pickedFormat);
				}
			}

			this.el.title = data.title + '\n' + formatDate(this.model.get('date'), pickedFormat + ' ' + timeFormatTitle);
			
			this.$el.html(this.template(data));

			return this;
		},
		handleMouseUp: function(e) {
			if (e.which == 3) {
				this.showContextMenu(e);
			} else if (app.articleList.selectedItems.length > 1 && app.articleList.selectFlag) {
				this.select({ shiftKey: e.shiftKey, ctrlKey: e.ctrlKey });	
				app.articleList.selectFlag = false;
			}
		},
		showContextMenu: function(e) {
			if (!this.$el.hasClass('selected')) {
				this.select(e);	
			}
			itemsContextMenu.currentSource = this.model;
			itemsContextMenu.show(e.clientX, e.clientY);
		},
		select: function(e) {
			e = e || {};
			if ( (e.shiftKey != true && e.ctrlKey != true) || (e.shiftKey && !app.articleList.selectPivot) ) {
				app.articleList.selectedItems = [];
				app.articleList.selectPivot = this;
				$('.selected').removeClass('selected');

				if (!e.preventLoading) {
					//bg.items.trigger('new-selected', this.model);
					if (!window || !window.frames) {
						bg.logs.add({ message: 'Event duplication bug! Clearing events now...' });
						bg.console.log('Event duplication bug! Clearing events now...');
						bg.sources.trigger('clear-events', -1);
						return;
					}
					/****topWindow.frames[2].postMessage({ action: 'new-select', value: this.model.id }, '*');****/
				}

				
				if (this.model.get('unread') && bg.settings.get('readOnVisit')) {
					this.model.save({
						visited: true,
						unread: false
					});
				} else if (!this.model.get('visited')) {
					this.model.save('visited', true);
				}
				
			} else if (e.shiftKey && app.articleList.selectPivot) {
				$('.selected').removeClass('selected');
				app.articleList.selectedItems = [app.articleList.selectPivot];
				app.articleList.selectedItems[0].$el.addClass('selected');

				if (app.articleList.selectedItems[0] != this) {
					if (app.articleList.selectedItems[0].$el.index() < this.$el.index() ) {
						app.articleList.selectedItems[0].$el.nextUntil(this.$el).not('.invisible,.date-group').each(function(i, el) {
							$(el).addClass('selected');
							app.articleList.selectedItems.push(el.view);
						});
					} else {
						this.$el.nextUntil(app.articleList.selectedItems[0].$el).not('.invisible,.date-group').each(function(i, el) {
							$(el).addClass('selected');
							app.articleList.selectedItems.push(el.view);
						});
					}

				}
			} else if (e.ctrlKey && this.$el.hasClass('selected')) {
				this.$el.removeClass('selected');
				this.$el.removeClass('last-selected');
				app.articleList.selectPivot = null;
				app.articleList.selectedItems.splice(app.articleList.selectedItems.indexOf(this), 1);
				return;
			} else if (e.ctrlKey) {
				app.articleList.selectPivot = this;
			}

			$('.last-selected').removeClass('last-selected');
			if (app.articleList.selectedItems[0] != this) {
				app.articleList.selectedItems.push(this);
				this.$el.addClass('selected');
			}
			this.$el.addClass('last-selected');

		},
		handleMouseDown: function(e) {
			if (app.articleList.selectedItems.length > 1 && this.$el.hasClass('selected') && !e.ctrlKey && !e.shiftKey) {
				app.articleList.selectFlag = true;
				return;
			}
			this.select({ shiftKey: e.shiftKey, ctrlKey: e.ctrlKey });	
		},
		handleModelChange: function() {
			if (this.model.get('deleted') || (app.articleList.specialName != 'trash' && this.model.get('trashed')) ) {
				app.articleList.destroyItem(this);
			} else {
				this.render();
			}
		},
		handleModelDestroy: function(mod, col, opt) {
			if (opt.noFocus && app.articleList.currentSource) return;
			app.articleList.destroyItem(this);
		},
		handleClickPin: function(e) {
			e.stopPropagation();
			this.model.save({ pinned: !this.model.get('pinned') });
		}
	});

	return ItemView;
});