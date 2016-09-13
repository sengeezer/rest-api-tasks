var Promise = require("bluebird");
var asyncDuring = require('async/during');

var verifyWord = require('./verifyWord').verifyWord;

function asWF (req, cW, Word) {
  return new Promise(function(resolve, reject) {
  var reqSize = req.length;
  var count = 0,
      resk;

  asyncDuring(
    function (callback) {
        return callback(null, count < reqSize);
    },
    function (callback) {
        verifyWord(req[count], Word, function(err, verified) {
          if (!err && (typeof verified !== 'undefined')) {
            cW.push(verified);
            //console.log('confd: ' + cW);
          }

          else if (err) {
            console.log('awf cb err: ' + err);
          }
        });

        count++;
        callback();
    },
    function (err) {
      if (!err) {
        resolve(cW);
      }

      else {
        console.log('during err: ' + err);
      }
    }
  );
});
}

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
        // console.log('assemble');
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
  assembleWordsFound: assembleWF,
  asWF: asWF
};
