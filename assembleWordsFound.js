var Promise = require("bluebird");

var verifyWord = require('./verifyWord').verifyWord;

function insideAWF(val, model) {
  return new Promise(function(resolve, reject) {
    var vW = verifyWord(val, model);

    if (vW !== null) {
      resolve(vW);
    }

    else {
      reject(new Error('reject on insideAWF'));
    }
  });
}

function assembleWF(req, cW, Word) {
  return new Promise(function(resolve, reject) {
    var koop = function(req){
      for (var i = 0; i < req.length; i++) {
        // console.log('inside for loop: ' + i);
        // var resk = verifyWord(req[i], Word);
        insideAWF(req[i], Word).then(function(resk){
          if (resk) {
            cW.push(resk);
            console.log('confirmed: ' + cW);
          }
          else {
            console.log('VW failed: ' + resk); // undefined
          }
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
