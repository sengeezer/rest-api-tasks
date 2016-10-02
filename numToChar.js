var numPads = require('./numPads');

var numToChar = function(numbers) {
  var result = [],
      summaryResult = [''];
      
  for (var i = 0; i < numbers.length; i++) {
    for (var j = 0; j < summaryResult.length; j++) {
      var currResult = summaryResult[j];
      for (var k = 0; k < numPads.numPadSimple[numbers[i]].length; k++) {
          result.push(currResult + numPads.numPadSimple[numbers[i]][k]);
      }
    }

    summaryResult = result;
    result = [];
  }

  return summaryResult;
}

module.exports = {
  numToChar: numToChar
};
