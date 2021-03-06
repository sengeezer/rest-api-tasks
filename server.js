// Load modules
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

var asyncWhilst = require('async/whilst');

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

// Utilities
var isEmpty = require('./utils/isEmpty');

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

router.route('/words/number/:word_number?')
  .get(function(req, res, next){
    findWords(req.wordNumber).then(function(found) {
      letterChop.init(found);
      letterChop.fileList(function(returned) {
        req.foundFiles = returned;
        next();
      });
    });
  });

router.route('/words/number/:word_number?')
  .get(function(req, res, next){
    var rff = req.foundFiles,
        confirmedWords = [],
        allCW = [],
        j = 0;

    asyncWhilst(
      function() { return j < rff.length; },
      function(callback) {
        letterChop.getContents(rff[j], (returned) => {
          confirmedWords = [];
          asWF(JSON.parse(returned), confirmedWords, (nReturned) => {
            if (typeof nReturned !== 'undefined' && !(isEmpty(nReturned))) {
              allCW.push(nReturned);
            }
            j++;
            callback(null, j);
          });
        });
      },
      function(err, results) {
        console.log('Cumulative result: ' + allCW);
        req.aswf = allCW;
        next();
      }
    );
  });

router.route('/words/number/:word_number?')
  .get(function(req, res, next){
    res.json({ result: req.aswf });
    next();
  });

// Define routes
app.use('/api', router);

// Start it up!
app.listen(port);
console.log('I\'ve been started up on port ' + port);
