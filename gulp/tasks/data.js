var gulp     = require('gulp');
var plumber  = require('gulp-plumber');

var gulpif = require("gulp-if");
var config = require("../config");
var isProduction = require('../config').isProduction;


gulp.task('data', function()
{
  gulp.src("src/**/*.{mp3,json}")
  .pipe(gulpif(isProduction, gulp.dest(config.PATH.BUILD), gulp.dest(config.PATH.DST)));
});