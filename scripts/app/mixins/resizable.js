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
			e.preventDefault();
			if (this.layout == 'vertical') {
				setPosition.call(this, e.clientY);
				this.$el.css('flex-basis', Math.abs(e.clientY - this.el.offsetTop) );
			} else {
				setPosition.call(this, e.clientX);
				this.$el.css('flex-basis', Math.abs(e.clientX - this.el.offsetLeft) );	
			}
			
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
		if (this.layout == 'vertical') {
			this.resizer.style.top = pos - Math.round(resizeWidth / 2) - 1 + 'px';
		} else {
			this.resizer.style.left = pos - Math.round(resizeWidth / 2) - 1 + 'px';	
		}
	}

	function loadPosition() {
		if (this.layout == 'vertical') {
			setPosition.call(this, this.el.offsetTop + this.el.offsetHeight);
		} else {
			setPosition.call(this, this.el.offsetLeft + this.el.offsetWidth);	
		}
	}

	return {
		resizing: false,
		resizer: null,
		layout: 'horizontal',
		enableResizing: function(layout) {

			this.layout = layout;

			els.push(this);

			var that = this;
			this.resizer = document.createElement('div');
			this.resizer.className = 'resizer';

			if (layout == 'vertical') {
				this.resizer.style.width = '100%';
				this.resizer.style.cursor = 'n-resize';
				this.resizer.style.height = resizeWidth + 'px';
			} else {
				this.resizer.style.height = '100%';
				this.resizer.style.cursor = 'w-resize';
				this.resizer.style.width = resizeWidth + 'px';
			}

			requestAnimationFrame(function() {
				loadPosition.call(this);
			}.bind(this));

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