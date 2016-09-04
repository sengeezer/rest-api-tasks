// Load modules

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Word = require('./models/word');

var findWords = require('./findWords');

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

// Define routes
app.use('/api', router);

// Start it up!
app.listen(port);
console.log('I\'ve been started up on port ' + port);
