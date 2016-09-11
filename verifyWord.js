var Promise = require("bluebird");

// check word candidates against dictionary
function verifyWord(req, model) {

  var query = model.find({name: req});

  query.exec(function (err, result){
    if (!err) {
      result = JSON.stringify(result);
    }
    else {
       return 'Error in query: ' + err;
    }
  })
  .then(function(newResult){
      if (String(newResult) !== '') {
        console.log('nr: ' + newResult);
        return newResult;
      }
  });

  return query;
}

module.exports = {
  verifyWord: verifyWord
};
