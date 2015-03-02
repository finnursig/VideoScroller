var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var umd = require('gulp-umd');

// var packageInfo = require('./package.json');

var i = 0;

gulp.task('script', function(){
    return gulp.src([
		'src/EasingFunctions.js',
		'src/VideoScroller.js'
	])
        .pipe(plumber())
        .pipe(babel())
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

gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['script']);
});

gulp.task('default', ['script', 'watch']);