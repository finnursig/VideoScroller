var VideoScroller = function(options){
	this.options = options || {};

	if(!this.options.el) {
		throw new Error('Missing video element ref.');
	}

	this.transitionTime = this.options.transitionTime || 2000;
	this.easingFunction = this.options.easingFunction || EasingFunctions.easeOutQuint;
	this.invert = this.options.invert !== undefined ? this.options.invert : false;
	this.scrollTimeout = this.options.scrollTimeout || 300;

	this.el = this.options.el;
	this.el.addEventListener('loadeddata', this.init.bind(this));
};

VideoScroller.prototype = {
	init: function(){
		this.videoDuration = this.el.duration;

		window.addEventListener('scroll', this.onScroll.bind(this), false);

		this.start(this.inView(this.el));
	},

	start: function(time){
		this.startTime = Date.now();

		this.currentTime = this.el.currentTime;
		this.targetDuration = (this.videoDuration * time) - this.el.currentTime;

		//console.log('time=', time,'targetTime=', this.currentTime, 'targetDuration', this.targetDuration);

		if(!this.intervalTimer){
			this.intervalTimer = setInterval(this.loop.bind(this), 50);
		}
	},

	loop: function(){
		var i = (Date.now() - this.startTime) / this.transitionTime;
		var easing = this.easingFunction(i);

		if(i >= 1){
			return;
		}

		this.el.currentTime = this.currentTime + this.targetDuration * easing;
		this.el.pause();
	},

	inView: function(){
		var scrollTop = document.body.scrollTop;
		var windowHeight = window.innerHeight;

		var elTop = this.el.getBoundingClientRect().top;
		var elHeight = this.el.offsetHeight;

		var fromTop = elTop - windowHeight;

		if(fromTop > 0){
			fromTop = 0;
		}

		var percentage = Math.abs(fromTop) / (windowHeight * 1.5);

		//console.log(scrollTop, elTop, percentage);

		if(!this.invert){
			percentage = 1-percentage;
		}

		if(percentage > 1){
			return 1;
		} else if(percentage < 0){
			return 0;
		}

		return percentage;
	},

	inCenter: function(el){
		var scrollTop = document.body.scrollTop;
		var windowHeight = window.innerHeight;

		var elTop = el.getBoundingClientRect().top;
		var elHeight = el.offsetHeight;

		var bar = elTop - (windowHeight / 2) + (elHeight / 2);

		var percentage = Math.abs(bar / (windowHeight / 2));

		if(percentage > 1){
			return 1;
		} else if(percentage < 0){
			return 0;
		}

		return percentage;
	},

	onScroll: function(){
		if(this.isWaiting) {
			return;
		}

		this.isWaiting = true;

		setTimeout(function(){
			this.isWaiting = false;

			var time = this.inView(this.el);

			if(time === undefined)
				return;

			this.start(time);
		}.bind(this), this.scrollTimeout);
	}
};