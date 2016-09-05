var numPads = require('./numPads');

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
