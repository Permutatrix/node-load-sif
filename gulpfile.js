var gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');
var del = require('del');


gulp.task('clean', function(cb) {
  del('./lib/**/*').then(function() { cb(); });
});

gulp.task('default', ['clean'], function() {
  return rollup({ entry: './src/parsing/load_sif.js' })
  .pipe(source('load_sif.js', './src/parsing'))
  .pipe(buffer())
  .pipe(babel({ presets: ['es2015-loose'] }))
  .pipe(gulp.dest('.'));
});
