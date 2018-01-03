var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var stripDebug = require('gulp-strip-debug');
var babel = require('gulp-babel');
var webpack = require('webpack');
var webpackConfig = require('../../webpack.config');
var config = require('../config');
var isProduction = require('../config').isProduction;


////// webpackは自作jsのコンパイルに使う
if (isProduction) {
  webpackConfig.output.path = config.PATH.BUILD;
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  );
  webpackConfig.module.loaders.unshift({ test: /\.js$/, loader: "strip-loader?strip[]=debug,strip[]=console.log" }); // console.log削除
} else {
  webpackConfig.output.path = config.PATH.DST;
  webpackConfig.cache = webpackConfig.debug = true;
}

var webpackCompiler = webpack(webpackConfig);

// js
gulp.task('js', function(cb){
  // return gulp.src(config.PATH.SRC + "assets/js/**/*.js")
  // .pipe(plumber())
  // // .pipe(babel())
  // .pipe(webpack(webpackConfig));
  webpackCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[js]', stats.toString({ colors: true }));
    cb();
  });

});


////// 外部ライブラリ //////

// ライブラリの順番
// var libFiles = [
//   config.PATH.SRC + 'assets/js/lib/jquery-3.1.0.min.js',
//   config.PATH.SRC + 'assets/js/lib/TweenMax.min.js',
//   config.PATH.SRC + 'assets/js/lib/ScrollToPlugin.js',
// ];

// var libHeadFiles = [
//   config.PATH.SRC + 'assets/js/lib.head/modernizr-custom.js',
//   config.PATH.SRC + 'assets/js/lib.head/useragnt-all.min.js',
// ];


// ライブラリ結合タスク
gulp.task('lib-js', function(){
  gulp.src(config.PATH.SRC + "assets/js/lib/*.js")
    .pipe(concat('lib.js'))
    // .pipe(gulpif(isProduction, stripDebug()))
    .pipe(gulpif(isProduction, uglify({preseveComments: 'some'})))
    .pipe(gulpif(isProduction, gulp.dest(config.PATH.BUILD + 'assets/js/'), gulp.dest(config.PATH.DST + 'assets/js/')));
});


gulp.task('lib-head-js', function(){
  gulp.src(config.PATH.SRC + "assets/js/lib.head/*.js")
    .pipe(concat('lib.head.js'))
    // .pipe(gulpif(isProduction, stripDebug()))
    .pipe(gulpif(isProduction, uglify({preseveComments: 'some'})))
    .pipe(gulpif(isProduction, gulp.dest(config.PATH.BUILD + 'assets/js/'), gulp.dest(config.PATH.DST + 'assets/js/')));
});