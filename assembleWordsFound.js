var Promise = require("bluebird");

var verifyWord = require('./verifyWord').verifyWord;

function assembleWF(req, cW, Word) {
  return new Promise(function(resolve, reject) {
    var koop = function(req){
      var reqSize = req.length;
      var i = 0;

      (function next() {
        if (i++ > reqSize) {
          return;
        }

        var resk = verifyWord(req[i], Word);
        console.log('assemble');
        if (typeof resk !== 'undefined') {
          cW.push(resk);
          //console.log('confirmed: ' + cW);
        }

        next();
      })();

      return cW;
    };

    resolve(koop(req));
    console.log('loop finished');

  });
}


module.exports = {
  assembleWordsFound: assembleWF
};
