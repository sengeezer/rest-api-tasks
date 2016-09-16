var Promise = require("bluebird");
// var asyncDuring = require('async/during');
var asyncWhilst = require('async/whilst');

var wordNumber = require('./models/word2');

function asWF (req, cW) {

    var reqSize = req.length;
    var count = 0,
        resk;

    asyncWhilst(
      function() { return count < reqSize; },
      function(callback) {
        wordNumber(req[count], function(err, verified) {
          console.log('verified: ' + verified);
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
        callback(null, count);
      },
      function(err, n) {
        console.log('err: ' + err + ' n: ' + n);
        return cW;

      }
    );
    /*
    asyncDuring(
      function (callback) {
        return callback(null, count < reqSize);
      },

      function (callback) {
        wordNumber(req[count], function(err, verified) {
          console.log('verified: ' + verified);
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
        callback(cW);
      },

      function (err) {
        if (err) {
          console.log('during err: ' + err);
        }

        return cW;
      }
    );
*/
}

module.exports = {
  asWF: asWF
};
