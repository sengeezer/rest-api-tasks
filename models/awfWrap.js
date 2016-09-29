
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
var Word = require('./word').Word;


var onErr = function(err, callback){
  mongoose.connection.close();
  callback(err);
};

module.exports = function(number, callback) {
  Word.find({name: number}, function(err, result){
    if (err) {
      onErr(err, callback);
    }

    else {
      mongoose.connection.close();
      callback('', result);
    }
  });
};
