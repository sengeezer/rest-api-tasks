var Promise = require("bluebird");

// check word candidates against dictionary
function verifyWord(req, model) {

  var query = model.find({name: req}),
      newResult;

  query.exec(function (err, result){
    if (!err) {
      var newResult = JSON.stringify(result);
    }
    else {
       return 'Error in query: ' + err;
    }
  }).then(function(newRes){
      if (String(newRes) !== '') {
        console.log('nr: ' + newRes);
        newResult = newRes;
        return newResult;
      }
  });
}

module.exports = {
  verifyWord: verifyWord
};
