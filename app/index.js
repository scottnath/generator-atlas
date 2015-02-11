'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
//var atlasUtil = require('../util.js');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Atlas') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What is the name of your application?',
      default: this.appname,
      required: true
    },{
      type: 'input',
      name: 'appDescription',
      message: 'In one sentence (' + chalk.red('or less') + ') describe your app?'
    },{
      type: 'confirm',
      name: 'requiredInstallations',
      message: 'Do you understand that Ruby, Node, and Bundler are required to ' + chalk.red('use') + ' Atlas?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.appNameCamel = this._.camelize(this._.slugify(this._.humanize(this.appName)));
      this.appNameSlug = this._.slugify(this._.humanize(this.appName));
      this.appDescription = props.appDescription;

      done();
    }.bind(this));
  },
  configuring: function () {
    this.config.set('appName', this.appName);
    this.config.set('appDescription', this.appDescription);
    this.config.set('appNameCamel', this.appNameCamel);
    this.config.set('appNameSlug', this.appNameSlug);
    this.config.save();
  },
  writing: {
    app: function () {
      this.mkdir('app');
      this.copy('app/_bower.json','app/bower.json');
      this.copy('app/_index.html','app/index.html');
      this.mkdir('app/_gulp');
      this.copy('app/_gulp/_config-overrides.js','app/_gulp/config-overrides.js');
    },

    gulpfiles: function(){
      this.copy('_gulpfile.js','gulpfile.js');
      this.mkdir('gulp');
      this.copy('gulp/_config.js','gulp/config.js');
      this.mkdir('gulp/tasks');
      this.copy('gulp/tasks/_help.js','gulp/tasks/help.js');
      this.copy('gulp/tasks/_default.js','gulp/tasks/default.js');
      this.mkdir('gulp/tasks/development');
      this.copy('gulp/tasks/development/_angular-templatecache.js','gulp/tasks/development/angular-templatecache.js');
      this.copy('gulp/tasks/development/_browser-sync.js','gulp/tasks/development/browser-sync.js');
      this.copy('gulp/tasks/development/_compass.js','gulp/tasks/development/compass.js');
      this.copy('gulp/tasks/development/_css-globbing.js','gulp/tasks/development/css-globbing.js');
      this.copy('gulp/tasks/development/_css-lint.js','gulp/tasks/development/css-lint.js');
      this.copy('gulp/tasks/development/_eslint.js','gulp/tasks/development/eslint.js');
      this.copy('gulp/tasks/development/_install.js','gulp/tasks/development/install.js');
      this.copy('gulp/tasks/development/_javascript-globbing.js','gulp/tasks/development/javascript-globbing.js');
      this.copy('gulp/tasks/development/_scss-lint.js','gulp/tasks/development/scss-lint.js');
      this.copy('gulp/tasks/development/_watch.js','gulp/tasks/development/watch.js');
      this.copy('gulp/tasks/development/_wiredep.js','gulp/tasks/development/wiredep.js');
      this.mkdir('gulp/tasks/production');
      this.copy('gulp/tasks/production/_browser-sync.js','gulp/tasks/production/browser-sync.js');
      this.copy('gulp/tasks/production/_build.js','gulp/tasks/production/build.js');
      this.copy('gulp/tasks/production/_gh-pages.js','gulp/tasks/production/gh-pages.js');

    },

    projectfiles: function () {
      this.copy('bowerrc','.bowerrc');
      this.copy('csslintrc','.csslintrc');
      this.copy('editorconfig','.editorconfig');
      this.copy('eslintrc','.eslintrc');
      this.copy('gitignore','.gitignore');
      this.copy('_config.rb','config.rb');
      this.copy('_Gemfile','Gemfile');
      this.copy('_package.json','package.json');
      this.copy('_scsslintrc.yml','scsslintrc.yml');
    }
  },

  install: function () {

    if (!this.options['skipInstall']) {
      this.spawnCommand('bundle', ['install','--path','vendor']);
    }

    this.installDependencies({
      skipInstall: this.options['skipInstall'],
      callback: function() {
        // Emit a new event - dependencies installed
        this.emit('dependenciesInstalled');
      }.bind(this)
    });

    // Bind to the dependencies installed event - turn on if bower components added in main Atlas
    // this.on('dependenciesInstalled', function() {
    //   this.spawnCommand('gulp', ['wiredep']);
    // });
  }
});
