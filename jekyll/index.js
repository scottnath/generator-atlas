'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cp = require('child_process');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // This method adds support for a `--folder` flag
    this.option('folder');
  },
  install: function () {
    this.jekyllFolder = (this.options.folder ? this.options.folder: "app");
    cp.exec('jekyll new ./'+this.jekyllFolder, function(error, stdout, stderr) {
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
          console.log('exec error: ', error);
      }
    });
  }
});
