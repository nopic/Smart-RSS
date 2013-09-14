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



});


});