var numPads = require('./numPads');

function getSlotVariants(currNum){
  var line = numPads.numPad[currNum],
      variants = [];

  for (var i = 0; i < line.length; i++) {
    variants[i] = line[i];
  }

  return variants;
}

function assembleSlotVariants(numArr) {
  var assembled = [];

  for (var i = 0; i < numArr.length; i++) {
    assembled[i] = getSlotVariants(numArr[i]);
  }
  // assembled = array (of arrays) of only possibilities for each slot
  return assembled;
}

// first loop: first slot[0]...first slot[n]
// second loop: second slot[0]...second slot[n]
// ...
// n loop: n slot[0]...n slot[n]
//
// N: eliminate any duplicates

var processSlotVariants = function(svs) {
  // n = svs.length
  // i = current slot
  // j = current variant
  // one loop = select slot, iterate over all variants

  var result = '',
      summaryResult = [];
  for (var i = 0; i < svs.length-1; i++) {
    for (var j = 0; j < svs[i].length; j++) {
      //
      // console.log(svs[i][j]);
      for (var k = 0; k < svs[i+1].length; k++) {
        if (svs[j][k] !== undefined) {
          result += svs[j][k];
        }
      }

      summaryResult.push(result);
      result = [];
    }
  }

  return summaryResult;
}

var numToChar = function(numbers) {
  var numArr = Array.from(numbers);
  var slotVariants = assembleSlotVariants(numArr);

  return processSlotVariants(slotVariants);
};

var numToCharOld = function(numbers) {
  var letters,
      lettersArr;
  var numArr = Array.from(numbers);

  for (var i=0; i < numArr.length; i++) {
    var letter = numPads.numPad[numArr[i].substring(0,1)][numArr[i].length];
    lettersArr.push(letter);
  }

  letters = lettersArr.join('');

  return letters;
}

module.exports = {
  numToChar: numToChar,
  numToCharOld: numToCharOld
};
