'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('atlas:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withArguments(['--skip-install'])
      .withPrompt({
        appName: 'test-name',
        appDescription: 'test sentence about nothing.',
        requiredInstallations: 'y'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.bowerrc'
    ]);
  });
});
