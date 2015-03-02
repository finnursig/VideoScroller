# VideoScroller.js

Video scrubbing on scroll with easing using no dependencies.

## Demo

[http://finnursig.github.io/VideoScroller](http://finnursig.github.io/VideoScroller)

## Installation

```
npm install video-scroller
```

## Usage

### HTML

Normal use:
```
<video src="video.mp4">
```

Using XHR to blob for performance
```
<video data-src="video.mp4">
```

### Javascript

```
new VideoScroller({
    el: document.getElementById('myVideoElement')
});
```

## Options

| Property | Type | Text | Default |
|----------|------|------|---------|
| `el` | element | video element
| `invert` | bool | reverses playback directions / scroll direction | false
| `scrollTimeout` | number | how often new position is calculated when scrolling in milliseconds | 300
| `easingFunction` | string / function | custom easing function, using only one parameter [0-1] and returning [0-1] | easeOutQuint

## Easing functions

See [EasingFunctions.js] (https://github.com/finnursig/VideoScroller/blob/master/src/EasingFunctions.js)

## Video requirements

To get the video to scroll smoothly it has to have a generous number of keyframes, here is how you would do that using [ffmpeg](https://www.ffmpeg.org/)

`ffmpeg -i input.mp4 -g 10 output.mp4`

## Changes

* **1.1.0**
	* Added XHR to blog option to get rid of "206 Partal Content" requests.
	* Easingfunction option can now be a string.
* **1.0.3**
	* Changed code from ES5 to ES6 using babel.
* **1.0.2**
* **1.0.1**
* **1.0.0**
