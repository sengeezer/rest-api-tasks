// Schema set up
var mongoose = require('mongoose');

mongoose.Promise = require("bluebird");

var Schema = mongoose.Schema;

var WordSchema = new Schema({
  name: String
});

WordSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});

module.exports = mongoose.model('Word', WordSchema);
