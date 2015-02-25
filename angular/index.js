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
  configuring: function(){
    var configs = this.config.getAll();
    for (var prop in configs) {
      if (configs.hasOwnProperty(prop)) {
        this[prop] = configs[prop];
      }
    }
  },
  promptModules: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'You are installing AngularJS in your ' + chalk.red('Atlas') + ' environment.'
    ));

    var prompts = [{
      type: 'checkbox',
      name: 'modules',
      message: 'Which modules would you like to include?',
      choices: [
      {
        value: 'animateModule',
        name: 'angular-animate.js',
        checked: false
      }, {
        value: 'ariaModule',
        name: 'angular-aria.js',
        checked: false
      }, {
        value: 'cookiesModule',
        name: 'angular-cookies.js',
        checked: false
      }, {
        value: 'messagesModule',
        name: 'angular-messages.js',
        checked: false
      }, {
        value: 'resourceModule',
        name: 'angular-resource.js',
        checked: false
      }, {
        value: 'routeModule',
        name: 'angular-route.js',
        checked: true
      }, {
        value: 'sanitizeModule',
        name: 'angular-sanitize.js',
        checked: false
      }, {
        value: 'touchModule',
        name: 'angular-touch.js',
        checked: false
      }
      ]
    }];
    this.prompt(prompts, function (props) {
      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
      this.animateModule = hasMod('animateModule');
      this.ariaModule = hasMod('ariaModule');
      this.cookiesModule = hasMod('cookiesModule');
      this.messagesModule = hasMod('messagesModule');
      this.resourceModule = hasMod('resourceModule');
      this.routeModule = hasMod('routeModule');
      this.sanitizeModule = hasMod('sanitizeModule');
      this.touchModule = hasMod('touchModule');

      var angMods = [];
      var angularDeps = ['templatescache']; // automatically include templatescache file

      if (this.animateModule) {
        angMods.push('angular-animate');
        angularDeps.push('ngAnimate');
      }

      if (this.ariaModule) {
        angMods.push('angular-aria');
        angularDeps.push('ngAria');
      }

      if (this.cookiesModule) {
        angMods.push('angular-cookies');
        angularDeps.push('ngCookies');
      }

      if (this.messagesModule) {
        angMods.push('angular-messages');
        angularDeps.push('ngMessages');
      }

      if (this.resourceModule) {
        angMods.push('angular-resource');
        angularDeps.push('ngResource');
      }

      if (this.routeModule) {
        angMods.push('angular-route');
        angularDeps.push('ngRoute');
        this.env.options.ngRoute = true;
      }

      if (this.sanitizeModule) {
        angMods.push('angular-sanitize');
        angularDeps.push('ngSanitize');
      }

      if (this.touchModule) {
        angMods.push('angular-touch');
        angularDeps.push('ngTouch');
      }

      if (angMods.length) {
        this.env.options.angMods = angMods;
        this.env.options.angularDeps = '\n    \'' + angularDeps.join('\',\n    \'') + '\'\n  ';
      }

      done();
    }.bind(this));

  },
  writing: {
    app: function () {
      this.angularFolder = (this.options.folder ? this.options.folder: "app");
      this.angularModules = this.env.options.angularDeps;
      this.ngRoute = this.env.options.ngRoute;

      this.mkdir('app/scripts');
      this.template('app/scripts/_app.js','app/scripts/app.js');
      this.template('app/scripts/_templates.js','app/scripts/templates.js');

      this.mkdir('app/main');
      this.template('app/main/_main-controller.js','app/main/main-controller.js');
      this.template('app/main/_main-controller_test.js','app/main/main-controller_test.js');
      this.template('app/main/_main.html','app/main/main.html');
      this.template('app/main/_main.scss','app/main/_main.scss');
    },

    update: function() {

      var indexFile = this.readFileAsString('app/index.html');
      indexFile = indexFile.replace('<html class="no-js">','<html class="no-js" ng-app="' + this.config.get('appNameCamel') + '">');
      if(this.env.options.ngRoute){
        indexFile = indexFile.replace('<!-- angular-view -->','<ng-view></ng-view>');
      }else{
        indexFile = indexFile.replace('<!-- angular-view -->','<div ng-include="\'main/main.html\'" ng-controller="MainCtrl"></div>');
      }
      indexFile = indexFile.replace('<!-- inject:js -->','<!-- inject:js -->\n    <script src="scripts/templates.js"></script>\n    <script src="scripts/app.js"></script>\n    <script src="main/main-controller.js"></script>');
      this.write('app/index.html',indexFile);

      var appGulpConfigFile = this.readFileAsString('app/_gulp/config-overrides.js');
      var appGulpNewConfigs = "config.javascriptGlobbing.files = [\n"
+ "  '!' + config.development.app + '/bower_components/**', // ignore bower-ingested scripts\n"
+ "  '!' + config.development.app + '/**/*_test.js', // ignore our test scripts\n"
+ "  '!' + config.development.app + '/karma.conf.js', // ignore our karma config\n"
+ "  '!' + config.development.app + '/_gulp/**', // ignore all files in the app's _gulp directory\n"
+ "  config.development.app + '/scripts/templates.js', // template script\n"
+ "  config.development.app + '/scripts/app.js', // main app script\n"
+ "  config.development.app + '/**/*.js' // main application file\n"
+ "];\n"
+ "\n"
+ "config.eslint.src = [\n"
+ "  '!app/bower_components/**', // ignore bower-ingested scripts\n"
+ "  '!' + config.development.app + '/scripts/templates.js', // template script\n"
+ "  'app/**/*.js'\n"
+ "];";
      appGulpConfigFile = appGulpConfigFile.replace('module.exports = config;',appGulpNewConfigs + '\nmodule.exports = config;');
      this.write('app/_gulp/config-overrides.js',appGulpConfigFile);
    }

  },
  install: function () {

    if (!this.options['skipInstall']) {

      var installs = ['angular'];
      if(this.env.options.angMods){
        for (var i = 0, len = this.env.options.angMods.length; i < len; i++) {
          installs.push(this.env.options.angMods[i]);
        }
      }
      this.bowerInstall(installs, { 'save': true });
      this.on('end', function () {
        this.spawnCommand('gulp', ['wiredep']); // change 'prepare' with your task.
      });
    }

  }

});
