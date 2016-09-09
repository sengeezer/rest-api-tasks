var Promise = require("bluebird");

var verifyWord = require('./verifyWord').verifyWord;

function assembleWF(req, cW, Word) {
  return new Promise(function(resolve, reject) {
    var koop = function(req){
      for (var i = 0; i < req.length; i++) {
        // console.log('i: ' + i);
        var resk = verifyWord(req[i], Word);

        if (resk) {
          cW.push(resk);
          console.log('confirmed: ' + cW);
        }
        else {
          console.log('VW failed');
        }
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
