var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');


gulp.task('clean', function(cb) {
  del('lib/**/*').then(function() { cb(); });
});

gulp.task('default', ['clean'], function() {
  return gulp.src('src/**/*.js')
  .pipe(babel({loose: 'all'}))
  .pipe(gulp.dest('lib'));
});
