
var numToChar = require('./numToChar');

// Find any word candidates from numbers entered
var findWords = function(inputNum) {
  if (typeof inputNum == 'number') {
    return numToChar(inputNum);
  }

  else {
    return 'NaN';
  }
};

module.exports {
  findWords: findWords
};
