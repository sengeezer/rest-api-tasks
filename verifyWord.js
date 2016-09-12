var Promise = require("bluebird");

// check word candidates against dictionary
function verifyWord(req, model) {
  // console.log('req: ' + req);
  var query = model.find({name: req}),
      parent = this,
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
  // if (newResult !== null && newResult !== undefined) {
  //   console.log('pn: ' + newResult);
  // }
  //
  // return newResult;
}

module.exports = {
  verifyWord: verifyWord
};
