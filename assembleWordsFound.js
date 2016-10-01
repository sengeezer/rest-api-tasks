var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

var asyncWhilst = require('async/whilst');
var asyncQueue = require('async/queue');

var wordNumber2 = require('./models/awfWrap');

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
      process.nextTick(function(){
        wordNumber2(task.rc, function(err, verified) {
          // continues after db conn closed
          if (!err) {
            if (typeof verified !== 'undefined' && !(isEmpty(verified))) {
              console.log('verified: ' + verified);
              cW.push(verified);
            }
          }
          else if (err) {
            console.log('awf cb err: ' + err);
          }
        });
      });

      callback();
    });

    wnq.drain = function() {
      console.log('all items have been processed');
      return cW;
    };

    asyncWhilst(
      function() { return count < reqSize; },
      function(callback) {
        wnq.push({ rc: req[count] }, function(err) {
          if (err) {
            console.log('queue error: ' + err);
          }
        });

        count++;
        callback(null, count);
      },
      function(err, n) {
        console.log('err: ' + err + ' n: ' + n);
      }
    );
}

module.exports = {
  asWF: asWF
};
