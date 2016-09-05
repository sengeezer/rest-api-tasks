
var numToChar = require('./numToChar').numToChar;

// Find any word candidates from numbers entered
var findWords = function(inputNum) {
  if (typeof inputNum == 'string') {
    return numToChar(inputNum);
  }

  else {
    return 'unexpeted input, type: ' + typeof inputNum;
  }
};

module.exports = {
  findWords: findWords
};
