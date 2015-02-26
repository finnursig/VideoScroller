# VideoScroller.js

## Getting started

```
new VideoScroller({
    el: document.getElementById('myVideoElement')
});
```

## Video requirements

To get the video to scroll smoothly is has to have a generous number of keyframes, here is how you would do that using [ffmpeg](https://www.ffmpeg.org/)

`ffmpeg -i input.mp4 -g 10 output.mp4`