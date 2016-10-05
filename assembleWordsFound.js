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
    console.log('asWF req length: ' + req.length + ' req[0]: ' + req[0]);
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

    function wnqPush(rc, cb) {
      wnq.push(rc, function(err) {
        if (err) {
          console.log('queue error: ' + err);
        }

        else {
          setImmediate(cb);
        }
      });
    }

    asyncWhilst(
      function() { return count < reqSize; },
      function(callback) {
        //console.log('line 50: ' + req[count]);
        wnqPush({ rc: req[count] }, (returned) => {
          //console.log('wnqPush: ' + returned);
          count++;
          callback(null, count);
        });

        // count++;
        // callback(null, count);
      },
      function(err, n) {
        console.log('err: ' + err + ' n: ' + n);
      }
    );
}

module.exports = {
  asWF: asWF
};
