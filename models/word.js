// Schema set up
var mongoose = require('mongoose');

mongoose.Promise = require("bluebird");

var Schema = mongoose.Schema;

var WordSchema = new Schema({
  name: String
});

function WordCollection(ext) {
  var WordCollectionSchema =  new Schema({
    name: String
  }, { collection: 'letter_' + ext});

  return mongoose.model('WordCollection', WordCollectionSchema);
}

WordSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});

module.exports = {
  Word: mongoose.model('Word', WordSchema),
  WordCollection: WordCollection
};
