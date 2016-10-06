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

function asWF (req, chkW) {
    var reqSize = req.length;
    // console.log('asWF req length: ' + req.length + ' req[0]: ' + req[0]);
    // console.log('asWF chkW: ' + chkW);
    var count = 0,
        resk;

    var wnq = asyncQueue(function(task, callback) {
      process.nextTick(function(){
        wordNumber2(task.rc, function(err, verified) {
          // continues after db conn closed
          if (!err) {
            if (typeof verified !== 'undefined' && !(isEmpty(verified))) {
              console.log('verified: ' + verified);
              chkW.push(verified);
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
      // console.log('all items have been processed');
      // console.log('drain: ' + chkW);
      return chkW;
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
        wnqPush({ rc: req[count] }, (returned) => {
          //console.log('wnqPush: ' + returned);
          count++;
          callback(null, count);
        });
      },
      function(err, results) {
        console.log('message: ' + err + ' results (count): ' + results);
      }
    );
}

module.exports = {
  asWF: asWF
};
