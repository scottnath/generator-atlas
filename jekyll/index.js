'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Kickin Jekyll ' + chalk.red('Atlas-Jekyll') + ' sub-generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOptionSub',
      message: 'Would you like to enable this SUB SUB option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOptionSub = props.someOptionSub;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_tester.js'),
        this.destinationPath('tester.js')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
