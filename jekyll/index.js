'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cp = require('child_process');
var fs = require('fs-extra');
var atlasUtils = require('../util.js');
var origAppDir;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the Atlas ' + chalk.red('Jekyll') + ' sub-generator!'
    ));
    if ((this.options.folder === 'app') || !this.options.folder){
      this.options['folder'] = 'app';
      var prompts = [{
        type: 'confirm',
        name: 'appDeleteFolder',
        message: 'This Jekyll sub-generator will ' + chalk.red('delete the ./app folder') + '. Do you want to continue?',
        default: false
      }];

      this.prompt(prompts, function (props) {
        if(!props.appDeleteFolder){
          console.log('You may specify a folder other than ' + chalk.yellow('./app') + ' by using the --folder flag');
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
    fs.appendFileSync('Gemfile', "gem 'jekyll', '~> 2.5.2'\n"); // NATH: check if this already exists?

    // NATH: this should attempt to move the folder a user chooses if not app
    if (this.options.folder === 'app'){
      fs.renameSync('./app', './app.bak');
      fs.deleteSync('./app', function(err) {
        if (err) return console.error('deleteSync\n'+err)

        console.log('./app folder removed')
      });
    } else {
      /// NATH: CHECK FOR USER-DEFINED FOLDER YO!
      // USER-DEFINED FOLDER SHOULD ALSO BE ADDED TO YO SITE-CONFIG
    }
  },
  install: function () {

    var installJekyllRuby = cp.execSync('bundle', ['install','--path','vendor']);
    //process.stdout.write(installJekyllRuby);

    this.jekyllFolder = (this.options.folder ? this.options.folder: "app");
    cp.execSync('jekyll new ./'+this.jekyllFolder, function(error, stdout, stderr) {
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
    fs.copySync(origAppDir + '/_gulp/', this.options.folder + '/_gulp', {recursive: true}, function(err, stdout, stderr) {

      if (err) return console.error(err)

      console.log(origAppDir + '/_gulp moved to jekyll folder');
      if (origAppDir === './app.bak'){
        fs.delete('./app.bak', function(err) {
          if (err) {
            return console.error(err);
          } else {
            console.log('./app.bak folder removed');
          }
        });
      }
    });

    var jekyllGulpConfigAddon = this.readFileAsString(this.templatePath() + '/_config-overrides-addon.js');
    var updateFileConfig = {
      fileToChange: './app/_gulp/config-overrides.js',
      contentToAdd: jekyllGulpConfigAddon,
      contentToReplace: 'module.exports = config;',
      includeReplaced: 'bottom', // top, bottom, false
    }
    atlasUtils.updateFile(updateFileConfig);

    this.copy('app/_gulp/_jekyll.js','app/_gulp/jekyll.js');
  }
});
