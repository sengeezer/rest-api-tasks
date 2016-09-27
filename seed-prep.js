// seed prep
var fs = require('fs');

var fullSet = require('./seeds/words.json');
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var letterIdx = 0;
var currLetter = alphabet[letterIdx];

var subset = {};

function file(letter) {
  return './seeds/letter_' + letter + '.json';
}

function scan(set, currLetter) {
  for (var x in set) {
    if(set[x]['name'].charAt(0) == currLetter) {
      if (!subset[currLetter]) {
        subset[currLetter] = [];
      }

      subset[currLetter].push('\n' + JSON.stringify({"name": set[x]['name']}));
    }
  }

  var toWrite = '[' + subset[currLetter] + '\n]';

  fs.appendFile(file(currLetter), toWrite, function(err) {
    if(err) {
      console.log('append failed: ' + err);
    }

    else if (letterIdx < alphabet.length - 1) {
      letterIdx++;
      newcurrLetter = alphabet[letterIdx];
      console.log('processing letter: ' + alphabet[letterIdx]);
      scan(fullSet, newcurrLetter);
    }
  });
}

scan(fullSet, currLetter);
