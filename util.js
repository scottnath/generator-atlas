'use strict';
var fs = require('fs');
var path = require('path');

function utilTest(){
  console.log('that worked baby!');
}

function updateFile (args) {
  var content = args.contentToAdd;
  if (args.includeReplaced === 'bottom'){
    content = args.contentToAdd + '\n' + args.contentToReplace;
  } else if (args.includeReplaced === 'top') {
    content = args.contentToReplace + '\n' + args.contentToAdd;
  }
  var filePath = path.join(process.cwd(), args.fileToChange);

  var appGulpConfigFile = fs.readFileSync(filePath, 'utf8');

  appGulpConfigFile = appGulpConfigFile.replace(args.contentToReplace,content);

  fs.writeFileSync(filePath, appGulpConfigFile);
}

module.exports = {
  utilTest: utilTest,
  updateFile: updateFile
};
