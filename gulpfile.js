var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var packageInfo = require('./package.json');

gulp.task('default', function(){
    return gulp.src('src/VideoScroller.js')
        .pipe(uglify())
        .pipe(rename('VideoScroller-'+ packageInfo.version +'.min.js'))
        .pipe(gulp.dest('dist/'));
});