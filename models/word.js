// Schema set up
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
  name: String
});

WordSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});

// WordSchema.static('findByNameAll', function (name, callback) {
//   this.find({ name: name }, callback).cursor().
//   on('data', function(doc) {
//     console.log(doc);
//     return doc;
//   }).
//   on('close', function() {
//     return 'done';
//   });
// });

module.exports = mongoose.model('Word', WordSchema);
