/***
 * VideoScroller.js
 * URL: https://github.com/finnursig/VideoScroller
 * Author: Finnur Sigurðsson (finnursigu@gmail.com)
 */

// IE10+: window.URL.createObjectURL

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
    this.easingFunction = typeof easingFunction == "function" ? easingFunction : EasingFunctions[easingFunction];
    this.debug = debug;

    if (!VideoScroller.isCompatibleWithCurrentBrowser) {
      return;
    }

    if(this.el.getAttribute('data-src')) {
      this.getVideo();
    } else {
      // if video is ready, init
      if(this.el.readyState > 1){
        this.init();
      } else {
        // else wait for it
        this.el.addEventListener('loadeddata', () => this.init());
      }
    }
  }

  static get isCompatibleWithCurrentBrowser(){
    if(!window.URL || !window.URL.createObjectURL) {
      return false;
    }

    if (!XMLHttpRequest) {
      return false;
    }

    return true;
  }

  getVideo(){
    const req = new XMLHttpRequest();

    req.open('get', this.el.getAttribute('data-src'), true);
    req.responseType = 'blob';
    req.withCredentials = false;

    req.onload = () => {
      this.el.addEventListener('loadeddata', () => this.init());
      this.el.src = window.URL.createObjectURL(req.response);
    };

    req.onprogress = (requestProgress) => {
      const percentage = Math.round(requestProgress.loaded / requestProgress.total * 100);

      if(this.debug)
        console.log('onprogress', percentage + '%');
    };

    req.onreadystatechange = () => {
      if (this.debug)
        console.log('onreadystatechange', req.readyState);
    };

    req.send();
  }

  init() {
    this.videoDuration = this.el.duration;

    if(this.debug){
        this.el.controls = true;
    }

    this.el.className = this.el.className + ' video-scroller-ready';

    window.addEventListener('scroll', (e) => this.onScroll(), false);

    this.start(this.inView(this.el));
  }

  start(time) {
    this.startTime = Date.now();

    this.currentTime = this.el.currentTime;
    this.targetDuration = (this.videoDuration * time) - this.el.currentTime;

    if(this.debug) {
        console.log('time=', time,'targetTime=', this.currentTime, 'targetDuration', this.targetDuration);
    }

    if(!this.intervalTimer){
        this.intervalTimer = setInterval(() => this.loop(), 60);
    }
  }

  loop() {
    const i = (Date.now() - this.startTime) / this.transitionTime;
    const easing = this.easingFunction(i);

    if(i >= 1){
        return;
    }

    this.el.currentTime = this.currentTime + this.targetDuration * easing;
    this.el.pause();
  }

  inView() {
    const windowHeight = window.innerHeight;

    const elTop = this.el.getBoundingClientRect().top;
    const elHeight = this.el.offsetHeight;

    let fromTop = elTop - windowHeight;

    if(fromTop > 0){
      fromTop = 0;
    }

    let percentage = Math.abs(fromTop) / (windowHeight + elHeight);

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

  onScroll() {
    if(this.isWaiting) {
        return;
    }

    this.isWaiting = true;

    setTimeout(() => {
      this.isWaiting = false;

      const time = this.inView(this.el);

      if(time === undefined)
          return;

      this.start(time);
    }, this.scrollTimeout);
  }
}
