// ディレクトリ内のファイルを全て削除

var gulp = require('gulp');
var del  = require('del');
var config = require('../config');
var isProduction = require('../config').isProduction;

gulp.task('clean:build', function(cb) {
  del([config.PATH.BUILD + '*']).then(function(paths) {
    console.log('Delete:\n', paths.join('\n'));
    cb();
  });
});
