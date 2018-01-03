var gulp = require('gulp');
var requireDir = require('require-dir');
//var watch = require('gulp-watch');
var PATH = require('./gulp/config').PATH;
var runSequence = require('run-sequence');


requireDir('./gulp/tasks');


// watch
gulp.task('watch', function(){
  gulp.watch(['src/**/*html'], ['html']);
  gulp.watch(['src/assets/js/**/*.js', 'src/**/*.js'], ['lib-head-js', 'lib-js', 'js']);
  gulp.watch(['src/assets/css/**/*.{scss,css}'], ['css']);
  gulp.watch(['src/assets/img/**/*.{png,jpg,jpeg,gif,svg}'], ['imagemin:dst']);
  gulp.watch(['src/assets/data/**/*.{mp3,json}'], ['data']);
  gulp.watch(['src/assets/glsl/**/*.{vert,frag}'], ['glsl']);
});


// task
gulp.task('predefault', function(){
  runSequence(
    'imagemin:dst',
    ['css', 'html'],
    'glsl',
    ['lib-head-js', 'lib-js', 'js'],
    'data',
    'browserSync',
    'watch'
  );
});


// develop
gulp.task('default', ['predefault'], function(){
  console.log('running default tasks...');
});


// public
gulp.task('build', function(){
  console.log('start build...');
  runSequence(
    'clean:build',
    'imagemin:build',
    ['css', 'html'],
    'glsl',
    ['lib-head-js', 'lib-js', 'js'],
    'data',
    'browserSync'
  );
});