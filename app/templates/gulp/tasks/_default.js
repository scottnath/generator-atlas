var gulp = require('gulp');

/*********************************************
Application-based gulp tasks and overrides
*/
var appGulpDir = '../../app/_gulp';
try {
  // require all files in APP's gulp directory
  require('require-dir')(appGulpDir);
}
catch (e) {
  console.log('App-folder-based _gulp directory does not exist.')
  console.log(e)
}

gulp.task('default', ['browsersync']);
