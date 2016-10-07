
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
var Word = require('./word').Word;

var WordCollection = require('./word').WordCollection;

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

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

    else if (!err){
      callback('', result);
    }
    else {
      mongoose.connection.close();
    }
  });
};
