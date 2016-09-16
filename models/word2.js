
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/rest-api-dev';

var db = mongoose.createConnection(dbURI);
db.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

var onErr = function(err, callback){
  mongoose.connection.close();
  callback(err);
};

module.exports = function(number, callback) {
  db.once('open', function(){
    var WordSchema = new mongoose.Schema({
      name: String
    });

    var Word = db.model('Word', WordSchema);
    Word.find({name: number}, function(err, result){
      if (err) {
        onErr(err, callback);
      }

      else {
        mongoose.connection.close();
        callback('', result);
      }
    })
  });
};
