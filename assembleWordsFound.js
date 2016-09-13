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

module.exports = {
  asWF: asWF
};
