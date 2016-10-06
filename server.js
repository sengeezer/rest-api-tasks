// Load modules

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
// var Promise = require("bluebird");
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

var asyncWaterfall = require('async/waterfall');

var Word = require('./models/word').Word;

var findWords = require('./findWords').findWords;
var asWF = require('./assembleWordsFound').asWF;

var letterChop = require('./letter-chop');

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
require('./models/dbConnect');

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
          var confirmedWords = [];

          asyncWaterfall([
            function(callback) {
              findWords(numberString).then(function(found) {
                callback(null, found);
              });
            },
            function(wordsFound, callback) {
              var assembledWords = asWF(wordsFound, confirmedWords);
              callback(null, assembledWords);
            }
          ], function (err, result) {
              if (!err) {
                res.json({result: 'result' + result});
              }

              else {
                res.json({ message: 'error on l162: ' + err});
              }
          });
        }
      });

      router.route('/words/number7/:word_number')
        .get(function(req, res, next){
          var numberString = req.params.word_number;

          if(numberString.includes('0') || numberString.includes('1')) {
            res.json({ message: '0 or 1 are not valid phoneword numbers'});
          }

          else {
            req.wordNumber = numberString;
            next();
          }
        });

      router.route('/words/number7/:word_number?')
        .get(function(req, res, next){
          findWords(req.wordNumber).then(function(found) {
            letterChop.init(found);
            letterChop.fileList(function(returned) {
              req.foundFiles = returned;
              next();
            });
          });
        });

        /*
        router.route('/words/number7/:word_number?')
          .get(function(req, res, next){
            res.json(req.foundFiles);
          });
          */

      router.route('/words/number7/:word_number?')
        .get(function(req, res, next){
          var rff = req.foundFiles,
              confirmedWords = [],
              allCW = [];
          for (var j = 0; j < rff.length; j++) {
            // console.log('j is: ' + rff[j]);
            letterChop.getContents(rff[j], (returned) => {
              allCW.push(asWF(JSON.parse(returned), confirmedWords));
            });
          }

          req.aswf = allCW;
          next();
        });

      router.route('/words/number7/:word_number?')
        .get(function(req, res, next){
          res.json({ message: req.aswf });
          next();
        });

// Define routes
app.use('/api', router);

// Start it up!
app.listen(port);
console.log('I\'ve been started up on port ' + port);
