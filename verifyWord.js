var Promise = require("bluebird");

var wordNumber = require('./models/word2');

// check word candidates against dictionary
function verifyWord(req, model, callback) {
  // console.log('req: ' + req);
  var query = model.find({name: req}, function(err, result){
    if (err) {
      onErr(err, callback);
    }

    else {
      callback('', result);
    }
  });

  var newQuery = 0;

  var parent = this,
      newResult;

  query.exec(function (err, result){
    if (!err) {
      result = JSON.stringify(result);
    }
    else {
       return 'Error in query: ' + err;
    }
  })
  .then(function(result){
      if (String(result) !== '') {
        console.log('nr: ' + result);
        // parent.newResult = result;
        return result;
      }
  });
}

module.exports = {
  verifyWord: verifyWord
};
