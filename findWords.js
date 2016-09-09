var Promise = require("bluebird");

var numToChar = require('./numToChar').numToChar;

// Find any word candidates from numbers entered
var findWords = function(inputNum) {
  return new Promise(function(resolve, reject) {
    if (typeof inputNum == 'string') {
      resolve(numToChar(inputNum));
    }
    else {
      reject(new Error('unexpeted input, type: ' + typeof inputNum));
    }
  });
};

module.exports = {
  findWords: findWords
};
