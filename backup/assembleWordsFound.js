var Promise = require("bluebird");
var asyncDuring = require('async/during');

var wordNumber = require('./models/word2');

function asWF (req, cW) {
  return new Promise(function(resolve, reject) {
    var reqSize = req.length;
    var count = 0,
        resk;

    asyncDuring(
      function (callback) {
        return callback(null, count < reqSize);
      },

      function (callback) {
        wordNumber(req[count], function(err, verified) {
          if (!err) {
            if (typeof verified !== 'undefined') {
              cW.push(verified);
            }
            console.log('confd: ' + verified);
          }
          else if (err) {
            console.log('awf cb err: ' + err);
          }
        });

        count++;
        callback();
      },

      function (err) {
        if (err) {
          console.log('during err: ' + err);
        }

        resolve(cW);
      }
    );
  });
}

module.exports = {
  asWF: asWF
};
