class VideoScroller {
    constructor({
        el,
        transitionTime = 2000,
        invert = false,
        scrollTimeout = 300,
        easingFunction = EasingFunctions.easeOutQuint,
        debug = false
    }) {
        if(!el) {
            throw new Error('Missing video element ref.');
        }

        this.el = el;
        this.transitionTime = transitionTime;
        this.invert = invert;
        this.scrollTimeout = scrollTimeout;
        this.easingFunction = easingFunction;
        this.debug = debug;

        // if video is ready, init
        if(this.el.readyState > 1){
            this.init();
        } else {
            // else wait for it
            this.el.addEventListener('loadeddata', () => this.init());
        }
    }

    init(){
        this.videoDuration = this.el.duration;

        if(this.debug){
            this.el.controls = true;
        }

        this.el.className = this.el.className + ' video-scroller-ready';

        window.addEventListener('scroll', (e) => this.onScroll(), false);

        this.start(this.inView(this.el));
    }

    start(time){
        this.startTime = Date.now();

        this.currentTime = this.el.currentTime;
        this.targetDuration = (this.videoDuration * time) - this.el.currentTime;

        if(this.debug) {
            console.log('time=', time,'targetTime=', this.currentTime, 'targetDuration', this.targetDuration);
        }

        if(!this.intervalTimer){
            this.intervalTimer = setInterval(() => this.loop(), 50);
        }
    }

    loop(){
        var i = (Date.now() - this.startTime) / this.transitionTime;
        var easing = this.easingFunction(i);

        if(i >= 1){
            return;
        }

        this.el.currentTime = this.currentTime + this.targetDuration * easing;
        this.el.pause();
    }

    inView(){
        var windowHeight = window.innerHeight;

        var elTop = this.el.getBoundingClientRect().top;
        var elHeight = this.el.offsetHeight;

        var fromTop = elTop - windowHeight;

        if(fromTop > 0){
            fromTop = 0;
        }

        var percentage = Math.abs(fromTop) / (windowHeight + elHeight);

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
    }

    inCenter(el){
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
    }

    onScroll(){
        if(this.isWaiting) {
            return;
        }

        this.isWaiting = true;

        setTimeout(() => {
            this.isWaiting = false;

            var time = this.inView(this.el);

            if(time === undefined)
                return;

            this.start(time);
        }, this.scrollTimeout);
    }
}
