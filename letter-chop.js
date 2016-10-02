// seed prep
var fs = require('fs');

var fullSet = fullSet | '';
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var letterIdx = 0;
var currLetter = alphabet[letterIdx];

var subset = {};

function file(letter) {
  return './letterChopTemp/letter_' + letter + '.json';
}

function wipe(filePath) {
  fs.stat(filePath, (err, stats) => {
    var fileSize = stats['size'];

    if (!err && fileSize > 10) {
      fs.writeFile(filePath, '', () => {
        console.log('Cleaned ' + filePath);
      });
    }
  });
}

function scan(set, currLetter) {
  for(var x in set) {
    if(set[x].charAt(0) == currLetter) {
      if (!subset[currLetter]) {
        subset[currLetter] = [];
      }

      subset[currLetter].push('\n' + JSON.stringify({"name": set[x]}));
    }
  }

  if(subset[currLetter] !== undefined) {
    var toWrite = '[' + subset[currLetter] + '\n]';

    wipe(file(currLetter));

    fs.appendFile(file(currLetter), toWrite, function(err) {
      if(err) {
        console.log('append failed: ' + err);
      }

      else if (letterIdx < alphabet.length - 1) {
        letterIdx++;
        newcurrLetter = alphabet[letterIdx];

        scan(fullSet, newcurrLetter);
      }
    });
  }
}

function init(inSet) {
  fullSet = inSet;
  scan(fullSet, currLetter);
}

module.exports = {
  init: init
};
