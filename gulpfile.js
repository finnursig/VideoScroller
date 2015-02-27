var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var umd = require('gulp-umd');

// var packageInfo = require('./package.json');

gulp.task('script', function(){
    return gulp.src([
		'src/EasingFunctions.js',
		'src/VideoScroller.js'
	])
        .pipe(concat('video-scroller.min.js'))
		.pipe(umd({
			exports: function(file) {
				return 'VideoScroller';
			},
			namespace: function(file) {
				return 'VideoScroller';
			}
		}))
		.pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['script'], function(){
	gulp.watch('src/**/*.js', ['script']);
});