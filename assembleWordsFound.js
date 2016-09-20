var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

// var fresh = require('fresh-require');
var asyncWhilst = require('async/whilst');
var asyncQueue = require('async/queue');

var wordNumber2 = require('./models/awfWrap');

// var wordNumber = require('./models/word2');
// var wordNumbers = fresh('./models/word2', require);

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function asWF (req, cW) {
    var reqSize = req.length;
    var count = 0,
        resk;

    var wnq = asyncQueue(function(task, callback) {
      // console.log('hello ' + task.name);
      callback();
    });

    wnq.drain = function() {
      console.log('all items have been processed');
    };

    asyncWhilst(
      function() { return count < reqSize; },
      function(callback) {
        wordNumber2(req[count], function(err, verified) {
          // continues after db conn closed
          if (!err) {
            if (typeof verified !== 'undefined' && !(isEmpty(verified))) {
              console.log('verified: ' + verified);
              cW.push(verified);
            }
            // works !
            // console.log('confd: ' + cW);
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
