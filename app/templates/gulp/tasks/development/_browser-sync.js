/**
 *  @fileOverview Uses Gulpjs to trigger browser-sync
 *
 *  @author       Scott Nath
 *
 *  @requires     NPM:gulp
 *  @requires     NPM:browser-sync
 *  @requires     /gulp/config.js
 */
'use strict';
var gulp        = require('gulp');
var browsersync = require('browser-sync');
var config      = require('../../config');

/**
 * Gulp task that triggers browser-sync
 * @function browsersync
 *
 * @param   config.browsersync.development.config development configuration
 * @param   config.browsersync.development.dependencies development dependencies
 *
 */
if(!Array.isArray(config.browsersync.development.dependencies)){
  config.browsersync.development.dependencies = [];
}
gulp.task('browsersync', config.browsersync.development.dependencies, function() {
  browsersync.init(null, config.browsersync.development.config, function (err, bs) {
    console.log('Started connect web server on ' + config.browsersync.development.config.host + ':' + config.browsersync.development.config.port);
  });
});

/**
 * Gulp task that triggers a browser-sync reload
 * @function browsersync-reload
 *
 */
gulp.task('browsersync-reload', function(){
  browsersync.reload();
});
