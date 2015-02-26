'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cp = require('child_process');
var fs = require('fs-extra');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    // This method adds support for a `--folder` flag
    this.option('folder');
    console.log('test');
    console.log(this.options.folder);
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the Atlas ' + chalk.red('Jekyll') + ' sub-generator!'
    ));
    console.log(this.options.folder);
    if ((this.options.folder === 'app') || !this.options.folder){
      this.options['folder'] = 'app';
      console.log(this.options.folder);
      var prompts = [{
        type: 'confirm',
        name: 'appDeleteFolder',
        message: 'This Jekyll sub-generator will ' + chalk.red('delete the ./app folder') + '. Do you want to continue?',
        default: false
      }];

      this.prompt(prompts, function (props) {
        if(!props.appDeleteFolder){
          process.abort();
        }
        done();
      }.bind(this));

    }
  },
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

  },
  writing: function () {
    // add jekyll to GEMFILE
    var gemFile = this.readFileAsString('Gemfile');
    fs.appendFileSync('Gemfile', "gem 'jekyll', '~> 2.5.2'\n");

    // NATH: this should attempt to move the folder a user chooses if not app
    if (this.options.folder === 'app'){
      fs.move('./app', './app.bak', function(err) {
        if (err) return console.error(err)
        console.log("./app folder backed up to ./app.bak");
      });
    }
  },
  install: function () {
    var history = cp.execSync('bundle', ['install','--path','vendor']);
    process.stdout.write(history);
    this.jekyllFolder = (this.options.folder ? this.options.folder: "app");
    cp.exec('jekyll new ./'+this.jekyllFolder, function(error, stdout, stderr) {
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
        console.log('exec error: ', error);
      }
    });
    if (this.options.folder === 'app'){
      var origAppDir = './app.bak';
    } else {
      var origAppDir = './app';
    }
    fs.copy(origAppDir+'/_gulp', this.options.folder, function(err) {
      if (err) return console.error(err)
      console.log("application _gulp moved to jekyll folder");
    });
  }
});
