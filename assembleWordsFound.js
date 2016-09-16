var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

// var fresh = require('fresh-require');
var asyncWhilst = require('async/whilst');
var wordNumber2 = require('./models/awfWrap');

// var wordNumber = require('./models/word2');

// var wordNumbers = fresh('./models/word2', require);

function asWF (req, cW) {
    var reqSize = req.length;
    var count = 0,
        resk;

    asyncWhilst(
      function() { return count < reqSize; },
      function(callback) {
        wordNumber2(req[count], function(err, verified) {
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
}

module.exports = {
  asWF: asWF
};
