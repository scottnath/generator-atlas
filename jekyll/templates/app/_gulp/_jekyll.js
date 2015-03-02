'use strict';
var gulp = require('gulp');
var browsersync = require('browser-sync');
var cp          = require('child_process');
var config = require('../../gulp/config');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll', function (done) {
  browsersync.notify(messages.jekyllBuild);

  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '-q', '--source=' + config.jekyll.src, '--destination=' + config.jekyll.dest, '--config=' + config.jekyll.config], {stdio: 'inherit'})
      .on('close', done);

});

gulp.task('jekyll-rebuild', ['jekyll'], function() {
  browsersync.reload();
});

gulp.task('jekyll-watch', function () {
  gulp.watch(config.jekyll.watch, ['jekyll-rebuild']);
});
