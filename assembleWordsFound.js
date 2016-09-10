var Promise = require("bluebird");

var verifyWord = require('./verifyWord').verifyWord;

function insideAWF(val, model) {
  return new Promise(function(resolve, reject) {
    // all vals passed correctly
    var floop = function(val, model) {
      return verifyWord(val, model);
    }

    resolve(floop(val, model));
  });
}

function assembleWF(req, cW, Word) {
  return new Promise(function(resolve, reject) {
    var koop = function(req){
      for (var i = 0; i < req.length; i++) {
        insideAWF(req[i], Word).then(function(resk){
          if (resk !== undefined) {
            cW.push(resk);
            // console.log('resk: ' + resk);
            console.log('confirmed: ' + cW);
          }
          // else {
          //   console.log('VW failed: ' + resk); // undefined
          // }
        });
      }
    };

    resolve(koop(req));
    console.log('loop finished');
    return cW;
  });
}


module.exports = {
  assembleWordsFound: assembleWF
};
