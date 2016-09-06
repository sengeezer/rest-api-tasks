var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//Map buttons to possible letters
var twoButton = ["a", "b", "c"];
var threeButton = ["d", "e", "f"];
var fourButton = ["g", "h", "i"];
var fiveButton = ["j", "k", "l"];
var sixButton = ["m", "n", "o"];
var sevenButton = ["p", "q", "r", "s"];
var eightButton = ["t", "u", "v"];
var nineButton = ["w", "x", "y", "z"];

var buttons = [
  [" "],
  [""],
  ["a", "b", "c"],
  ["d", "e", "f"],
  ["g", "h", "i"],
  ["j", "k", "l"],
  ["m", "n", "o"],
  ["p", "q", "r", "s"],
  ["t", "u", "v"],
  ["w", "x", "y", "z"]
];

//Not sure whether to Switch over each number input and use individual button variables, or use one big array.

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  var combinationList = Array();
  res.render('index', {combinationList: combinationList});
});

app.post('/calculate', function(req, res){
  var numString = String(req.body.numbers);
  var prevCombinationlist = Array();
  var combinationList = Array("");

  for (var i = 0; i < numString.length; i++) { // each number
      for (var j = 0; j < combinationList.length; j++) { // each CL entry
        var resultString = combinationList[j]; // RS -> CL entry
        for (var k = 0; k < buttons[numString[i]].length; k++) { // each entry in current number's child array
          prevCombinationlist.push(resultString + buttons[numString[i]][k]);
          // add value of entry to PCL
        }
      }
      combinationList = prevCombinationlist; // for each number, CL gets added to
      prevCombinationlist = new Array();
  }
  res.render('index', {combinationList: combinationList});
});

app.use(express.static(__dirname));

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
