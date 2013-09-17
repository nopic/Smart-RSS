define(['jquery'], function($) {

	var els = [];

	var resizeWidth = 6;

	function handleMouseDown(e) {
		this.resizing = true;
		e.preventDefault();
		$('iframe').css('pointer-events', 'none');
		this.trigger('resize:before');
	}

	function handleMouseMove(e) {
		if (this.resizing) {
			setPosition.call(this, e.clientX);
			e.preventDefault();
			this.$el.css('flex-basis', Math.abs(e.clientX - this.el.offsetLeft) );
			this.trigger('resize');

			for (var i=0; i<els.length; i++) {
				if (this == els[i]) continue;
				loadPosition.call(els[i]);
			}
		}
	}

	function handleMouseUp() {
		if (!this.resizing) return;
		$('iframe').css('pointer-events', 'auto');
		this.resizing = false;
		this.trigger('resize:after');
	}

	function setPosition(pos) {
		this.resizer.style.left = pos - Math.round(resizeWidth / 2) - 1 + 'px';
	}

	function loadPosition() {
		setPosition.call(this, this.el.offsetLeft + this.el.offsetWidth);
	}

	return {
		resizing: false,
		resizer: null,
		enableResizing: function() {

			els.push(this);

			var that = this;
			this.resizer = document.createElement('div');
			this.resizer.className = 'resizer';

			loadPosition.call(this);

			this.resizer.style.width = resizeWidth + 'px';

			this.resizer.addEventListener('mousedown', function(e) {
				handleMouseDown.call(that, e);
			});
			document.addEventListener('mousemove', function(e) {
				handleMouseMove.call(that, e);
			});
			document.addEventListener('mouseup', function(e) {
				handleMouseUp.call(that, e);
			});

			document.body.appendChild(this.resizer);
		}
	};
});