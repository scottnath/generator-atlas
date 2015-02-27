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
gulp.task('jekyll-build', function (done) {
  console.log(config.jekyll);
  browsersync.notify(messages.jekyllBuild);

  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '-q', '--source=' + config.jekyll.src, '--destination=' + config.jekyll.dest, '--config=' + config.jekyll.config], {stdio: 'inherit'})
      .on('close', done);

});

gulp.task('jekyll-rebuild', ['jekyll'], function() {
  browsersync.reload();
});

gulp.task('jekyll-install', function (done) {
  console.log('jekyll-install');
    return cp.exec('jekyll new ./test', function(error, stdout, stderr) {
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
          console.log('exec error: ', error);
      }
  });
});
