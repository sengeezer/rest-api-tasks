
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
var Word = require('./word').Word;

var WordCollection = require('./word').WordCollection;


var onErr = function(err, callback){
  mongoose.connection.close();
  callback(err);
};

module.exports = function(toVerify, callback) {
  var WCmm = WordCollection(toVerify.charAt(0));

  WCmm.find({name: toVerify}, function(err, result){
    if (err) {
      onErr(err, callback);
    }

    else {
      mongoose.connection.close();
      callback('', result);
    }
  });
};
/*
module.exports = function(toVerify, callback) {
  Word.find({name: toVerify}, function(err, result){
    if (err) {
      onErr(err, callback);
    }

    else {
      mongoose.connection.close();
      callback('', result);
    }
  });
};
*/
