// Load modules

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise = require("bluebird");

var Word = require('./models/word');

var findWords = require('./findWords').findWords;

// Retrieve data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set port and routes
var port = process.env.PORT || 8080;
var router = express.Router();

// User and data validation and analytics
router.use(function(req, res, next) {
    console.log('Router in use');
    next();
});

// Set up database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/rest-api-dev');

// Respond to basic request
router.get('/', function(req, res) {
    res.json({ message: 'We\'ll do it live!' });
});

// CRUD routes
// Summary CRUD
router.route('/words')
  .post(function(req, res){
    var word = new Word();
    word.name = req.body.name;

    word.save(function(err){
      if (err) {
        res.send(err);
      }

      res.json({message: 'Word successfully created.'})
    });
  })
  .get(function(req,res){
    Word.find(function(err, words){
      if (err) {
        res.send(err);
      }

      res.json(words);
    })
  });

// Singular CRUD
router.route('/words/:word_id')
  .get(function(req, res){
    Word.findById(req.params.word_id, function(err, word){
      if (err) {
        res.send(err);
      }

      res.json(word);
    })
  })
  .put(function(req, res){
    Word.findById(req.params.word_id, function(err, word){
      if (err) {
        res.send(err);
      }

      word.name = req.body.name;

      word.save(function(err){
        if (err) {
          res.send(err);
        }

        res.json({message: 'Word updated'});
      });
    });
  })
  .delete(function(req, res){
    Word.remove(
      {_id: req.params.word_id}, function(err, word){
        if (err) {
          res.send(err);
        }

        res.json({message: 'Deletion successful'});
      });
  });

  router.route('/words/name/:word_name')
    .get(function(req, res){
      Word.findByName(req.params.word_name, function(err, word){
        if (err) {
          res.send(err);
        }

        res.json(word);
      })
    });

    router.route('/words/number/:word_number')
      .get(function(req, res){
        var numberString = req.params.word_number;

        if(numberString.includes('0') || numberString.includes('1')) {
          res.json({ message: '0 or 1 are not valid phoneword numbers'});
        }

        else {
          var wordsFound;
          // var wordsFound = findWords(numberString);
          var confirmedWords = [];

          findWords(numberString).then(function(rval) {
            wordsFound = rval;
            // console.log('req before koop: ' + wordsFound);
          }).catch(function() {
            console.log('findWords failed');
          });

          // check word candidates against dictionary
          function verifyWord(req, res) {
            var query = Word.find({name: req});

            query.exec(function (err, result){
              if (!err) {
                var newResult = JSON.stringify(result);
              }

              else {
                 return 'Error in query: ' + err;
              }
            }).then(function(newResult){
                // console.log('l140: ' + res);
                if (String(newResult) !== '') {
                  res(newResult);
                  // return newResult;
                  console.log('nr: ' + newResult);
                  //confirmedWords.push(newResult);
                }
              });

            // );
          }

          function assembleWF(req) {
            // var nreq = req;
            return new Promise(function(resolve, reject) {
              // console.log('i: ');
              var koop = function(req){
                // console.log('req in koop: ' + req);
                for (var i = 0; i < req.length; i++) {
                  console.log('i: ' + i);
                  verifyWord(req[i], function(resk){
                    if (resk) {
                      confirmedWords.push(resk);
                      console.log('confirmed: ' + confirmedWords);
                    }

                    else {
                      console.log('VW failed');
                    }
                  });
                }
              };

              resolve(koop(req));
              console.log('loop finished');
              //return confirmedWords;
            });
          }

          assembleWF(wordsFound).then(function(reso){
            console.log('reso: ' + reso); // undefined
            if (reso) {
              res.json(reso);
            }

            else {
              res.json({ message: 'error on l179'});
            }
          });
        }
      });

// Define routes
app.use('/api', router);

// Start it up!
app.listen(port);
console.log('I\'ve been started up on port ' + port);
