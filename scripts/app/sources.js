
	

	

	

	var AppToolbar = Backbone.View.extend({
		el: '#toolbar',
		events: {
			'click #button-add': 'addSourceDialog',
			'click #button-add-folder': 'addFolderDialog',
			'click #button-reload': 'reloadSources'
		},
		initialize: function() {
			
		},
		addFolderDialog: function() {
			var title = (prompt(bg.lang.c.FOLDER_NAME + ': ') || '').trim();
			if (!title) return;

			bg.folders.create({
				title: title
			}, { wait: true });

		},
		addSourceDialog: function() {
			var url = (prompt(bg.lang.c.RSS_FEED_URL) || '').trim();
			if (!url)  return;

			var folderID = 0;
			if (list.selectedItems.length && list.selectedItems[0] instanceof FolderView) {
				var fid = list.selectedItems[0].model.get('id');
				// make sure source is not added to folder which is not in db
				if (bg.folders.get(fid)) {
					folderID = fid;	
				}
			}

			url = this.fixURL(url);
			bg.sources.create({
				title: url,
				url: url,
				updateEvery: 180,
				folderID: folderID
			}, { wait: true });

		
		},
		reloadSources: function() {
			bg.downloadAll(true);
		},
		fixURL: function(url) {
			if (url.search(/[a-z]+:\/\//) == -1) {
				url = 'http://' + url;
			}
			return url;
		}
	});


	
	

	


	var properties = new (Backbone.View.extend({
		el: '#properties',
		currentSource: null,
		events: {
			'click button' : 'handleClick',
			'keydown button' : 'handleKeyDown',
			'click #advanced-switch' : 'handleSwitchClick',
		},
		initialize: function() {
			
		},
		handleClick: function(e) {
			var t = e.currentTarget;
			if (t.id == 'prop-cancel') {
				this.hide();
			} else if (t.id == 'prop-ok') {
				this.saveData();
			}
		},
		saveData: function() {
			if (!this.currentSource) {
				this.hide();
				return;
			}

			this.currentSource.save({
				title: $('#prop-title').val(),
				url: this.fixURL($('#prop-url').val()),
				username: $('#prop-username').val(),
				password: $('#prop-password').val(),
				updateEvery: parseFloat($('#prop-update-every').val())
			});

			this.hide();

		},
		handleKeyDown: function(e) {
			if (e.keyCode == 13) {
				this.handleClick(e);
			} 
		},
		show: function(source) {
			$('#prop-title').val(source.get('title'));;
			$('#prop-url').val(source.get('url'));
			$('#prop-username').val(source.get('username'));
			$('#prop-password').val(source.get('password'));
			if (source.get('updateEvery')) {
				$('#prop-update-every').val(source.get('updateEvery'));	
			}
			
			properties.$el.css('display', 'block');
		},
		hide: function() {
			properties.$el.css('display', 'none');
		},
		handleSwitchClick: function() {
			$('#properties-advanced').toggleClass('visible');
			$('#advanced-switch').toggleClass('switched');
		}
	}));
