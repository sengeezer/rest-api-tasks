var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

var asyncWhilst = require('async/whilst');
var asyncQueue = require('async/queue');

var wordNumber2 = require('./models/awfWrap');

var isEmpty = require('./utils/isEmpty');

function asWF (req, chkW, ncb) {
    var reqSize = req.length;
    var count = 0,
        resk;

    var wnq = asyncQueue(function(task, callback) {
      process.nextTick(function(){
        wordNumber2(task.rc, function(err, verified) {
          if (!err) {
            if (typeof verified !== 'undefined' && !(isEmpty(verified))) {
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
          count++;
          callback(null, count);
        });
      },
      function(err, results) {
        if (!err) {
          ncb(chkW);
        }
      }
    );
}

module.exports = {
  asWF: asWF
};
