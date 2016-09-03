var fs = require('fs');
var readline = require('readline');

var numPad = {
'2':{'1': 'a','2': 'b','3': 'c'},
'3':{'1': 'd','2': 'e','3': 'f'},
'4':{'1': 'g','2': 'h','3': 'i'},
'5': {'1': 'j','2': 'k','3': 'l'},
'6': {'1': 'm','2': 'n','3': 'o'},
'7': {'1': 'p','2': 'q','3': 'r','4': 's'},
'8': {'1': 't','2': 'u','3': 'v'},
'9': {'1': 'w','2': 'x','3': 'y','4': 'z'}};

var rd = readline.createInterface({
  input: fs.createReadStream('./brit-a-z.txt'),
  output: process.stdout,
  terminal: false
});

function checkDict(string){
  rd.on('line', function(line) {
    if(line.substring(0,string.length) === string){
      console.log(line);
    }
  });
}

function numToText(numbers) {
  var parts = numbers.split(' ');
  var letters = [];

  for (var i=0; i<parts.length; i++) {
    var letter = numPad[parts[i].substring(0,1)][parts[i].length];
    letters.push(letter);
  }

  checkDict(letters.join(''));
}
