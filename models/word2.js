var mongoose = require('mongoose'),

db = mongoose.createConnection('mongodb://localhost:27017/rest-api-dev');
db.on('error', console.error.bind(console, 'connection error:'));

var onErr = function(err,callback){
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
