var Promise = require("bluebird");

var verifyWord = require('./verifyWord').verifyWord;

function insideAWF(val, model) {
  return new Promise(function(resolve, reject) {
    // all vals passed correctly
    // var floop = function(val, model) {
    //   return verifyWord(val, model);
    // }
    var floop = verifyWord(val, model);
    // console.log('type: ' + typeof floop);
    if (typeof floop !== 'undefined') {
      // console.log('floop: ' + floop);
    }

    resolve(floop);
  });
}

function assembleWF(req, cW, Word) {
  return new Promise(function(resolve, reject) {
    var koop = function(req){
      var reqSize = req.length;
      var i = 0;

      (function next() {
        if (i++ > reqSize) return;

        insideAWF(req[i], Word).then(function(resk){
          // console.log('2type: ' + typeof resk)
          if (typeof resk !== 'undefined') {
            cW.push(resk);

            //console.log('confirmed: ' + cW);
          }

          next();
        });

      })();

      return cW;
    };

    resolve(koop(req));
    console.log('loop finished');

  });
}


module.exports = {
  assembleWordsFound: assembleWF
};
