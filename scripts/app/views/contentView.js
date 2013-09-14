define(['backbone'], function(BB) {
	var ContentView = BB.View.extend({
		tagName: 'header',
		template: '#template-header',
		frameLoaded: false,
		events: {
			'mousedown': 'handleMouseDown',
			'click .pin-button': 'handlePinClick',
			'keydown': 'handleKeyDown'
		},
		handleMouseDown: function(e) {
			if (overlay.isVisible() && !e.target.matchesSelector('.overlay, .overlay *')) {
				overlay.hide();
			}
		},
		handlePinClick: function(e) {
			$(e.currentTarget).toggleClass('pinned');
			this.model.save({
				pinned: $(e.currentTarget).hasClass('pinned')
			});
		},
		initialize: function() {
			var that = this;
			window.addEventListener('message', function(e) {
				if (e.data.action == 'new-select') {
					that.handleNewSelected(bg.items.findWhere({ id: e.data.value }));
				} else if (e.data.action == 'no-items') {
					that.model = null;
					that.hide();
				} else if (e.data.action == 'space-pressed') {
					that.handleSpace();
				}
			});

			bg.items.on('change:pinned', this.handleItemsPin, this);
			bg.sources.on('clear-events', this.handleClearEvents, this);
		},
		attach: function() {
			return this;
		},
		handleClearEvents: function(id) {
			if (window == null || id == window.top.tabID) {
				bg.items.off('change:pinned', this.handleItemsPin, this);
				bg.sources.off('clear-events', this.handleClearEvents, this);
			}
		},
		handleItemsPin: function(model) {
			if (model == this.model) {
				this.$el.find('.pin-button').toggleClass('pinned', this.model.get('pinned'));
			}
		},
		getFormatedDate: function(unixtime) {
			var dateFormats = { normal: 'DD.MM.YYYY', iso: 'YYYY-MM-DD', us: 'MM/DD/YYYY' };
			var pickedFormat = dateFormats[bg.settings.get('dateType') || 'normal'] || dateFormats['normal'];

			var timeFormat = bg.settings.get('hoursFormat') == '12h' ? 'H:mm a' : 'hh:mm:ss';

			return formatDate(new Date(unixtime), pickedFormat + ' ' + timeFormat);
		},
		renderTime: null,
		render: function() {
			clearTimeout(this.renderTime);

			if (!this.model) return;

			this.renderTime = setTimeout(function(that) {
				that.show();

				var date = that.getFormatedDate(that.model.get('date'));
				var source = that.model.getSource(); 
				var content = that.model.get('content');


				that.$el.find('h1 a').html(that.model.escape('title'));
				that.$el.find('h1 a').attr('href', escapeHtml(that.model.get('url')) );
				that.$el.find('.author').html(that.model.escape('author'));
				that.$el.find('.date').html(date);
				that.$el.find('.pin-button').toggleClass('pinned', that.model.get('pinned'));
				//that.$el.find('iframe').attr('src', 'data:text/html;charset=utf-8;base64,' + content);

				// first load might be too soon
				var fr = that.$el.find('iframe').get(0);
				fr.contentWindow.scrollTo(0, 0);
				fr.contentWindow.stop();

				if (fr.contentDocument.readyState == 'complete') {
					try {
						fr.contentDocument.documentElement.style.fontSize = bg.settings.get('articleFontSize') + '%';
						fr.contentDocument.querySelector('base').href = source.get('url');
						fr.contentDocument.querySelector('#smart-rss-content').innerHTML = content;
						fr.contentDocument.querySelector('#smart-rss-url').href = that.model.get('url');
					} catch(e) {}
				} 
				if (!that.frameLoaded) {
					if (!fr.contentDocument.documentElement || fr.contentDocument.documentElement.innerHTML != content) {
						var that = that;
						fr.onload = function() {
							itemView.frameLoaded = true;
							fr.contentDocument.documentElement.style.fontSize = bg.settings.get('articleFontSize') + '%';
							fr.contentDocument.querySelector('base').href = source ? source.get('url') : '#';
							fr.contentDocument.querySelector('#smart-rss-content').innerHTML = content;
							fr.contentDocument.querySelector('#smart-rss-url').href = that.model.get('url');
						};
					}
				}
			}, 50, this);

			return this;
		},
		handleNewSelected: function(model) {
			this.model = model;
			if (!this.model) {
				// should not happen but happens
				this.hide();
			} else {
				this.render();	
			}
			
		},
		hide: function() {
			$('header,iframe').css('display', 'none');
		},
		show: function() {
			$('header,iframe').css('display', 'block');
		},
	});

	return new ContentView();
});