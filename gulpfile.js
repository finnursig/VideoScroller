var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function(){
    return gulp.src('src/VideoScroller.js')
        .pipe(uglify())
        .pipe(rename('VideoScroller-1.0.0.min.js'))
        .pipe(gulp.dest('dist/'));
});