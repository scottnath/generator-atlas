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
    if ( this.options.folder && ( (this.options.folder === '.bundle') || (this.options.folder === 'node_modules') || (this.options.folder === 'gulp') || (this.options.folder === 'vendor') ) ) {
      console.log('You MUST specify a folder other than ' + chalk.yellow(this.options.folder) + ' by using the --folder flag');
      process.abort();
    }
    if ((this.options.folder === 'app') || !this.options.folder){
      this.options['folder'] = 'app';
      this.jekyllFolder = 'app';
      var prompts = [{
        type: 'confirm',
        name: 'appDeleteFolder',
        message: 'This Jekyll sub-generator will ' + chalk.red('delete the ./app folder') + '. Do you want to continue?',
        default: false
      }];

      this.prompt(prompts, function (props) {
        this.approveDeleteFolder = props.appDeleteFolder;
        if(!props.appDeleteFolder){
          console.log('You may specify a folder other than ' + chalk.yellow('./app') + ' by using the --folder flag');
          process.abort();
        }
        done();
      }.bind(this));

    } else {
      this.jekyllFolder = this.options.folder;
      if(fs.existsSync(this.options.folder)) {
        var prompts = [{
          type: 'confirm',
          name: 'appDeleteFolder',
          message: 'This Jekyll sub-generator will ' + chalk.red('delete the ./' + this.options.folder + ' folder') + '. Do you want to continue?',
          default: false
        }];

        this.prompt(prompts, function (props) {
          this.approveDeleteFolder = props.appDeleteFolder;
          if(!props.appDeleteFolder){
            console.log('You may specify a folder other than ' + chalk.yellow('./' + this.options.folder) + ' by using the --folder flag');
            process.abort();
          }
          done();
        }.bind(this));
      }
    }
    done();
  },
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },
  writing: function () {

    this.config.set('jekyllFolder', this.jekyllFolder);
    // add jekyll to GEMFILE
    var gemFile = this.readFileAsString('Gemfile');
    fs.appendFileSync('Gemfile', "gem 'jekyll', '~> 2.5.2'\n"); // NATH: check if this already exists?

    // backing up existing folder
    if (typeof this.approveDeleteFolder != 'undefined') {
      fs.renameSync('./'+ this.jekyllFolder, './' + this.jekyllFolder + '.bak');
      fs.deleteSync('./' + this.jekyllFolder, function(err) {
        if (err) return console.error('deleteSync\n'+err)

        console.log('./' + this.jekyllFolder + ' folder removed')
      });
    }
  },
  install: function () {
    var installJekyllRuby = cp.execSync('bundle', ['install','--path','vendor']);
    process.stdout.write(installJekyllRuby);

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
    });

    var jekyllGulpConfigAddon = this.readFileAsString(this.templatePath() + '/_config-overrides-addon.js');
    jekyllGulpConfigAddon = jekyllGulpConfigAddon.replace('<%= jekyllFolder %>',this.jekyllFolder);
    var updateFileConfig = {
      fileToChange: './app/_gulp/config-overrides.js',
      contentToAdd: jekyllGulpConfigAddon,
      contentToReplace: 'module.exports = config;',
      includeReplaced: 'bottom', // top, bottom, false
    }
    atlasUtils.updateFile(updateFileConfig);

    this.copy('app/_gulp/_jekyll.js','app/_gulp/jekyll.js');
    if (origAppDir === './app.bak'){
      fs.deleteSync('./app.bak', function(err) {
        if (err) {
          return console.error(err);
        } else {
          console.log('./app.bak folder removed');
        }
      });
    }
  }
});
