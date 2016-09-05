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
  // assembled = array of only possibilities for each slot
  return assembled;
}

// first loop: first slot[0]...first slot[n]
// second loop: second loop[0]...second loop[n]
// ...
// n loop: n loop[0]...n loop[n]
//
// N: eliminate any duplicates

var numToChar = function(numbers) {
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

module.exports {
  numToChar: numToChar
};
