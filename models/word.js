// Schema set up
var mongoose = require('mongoose');

mongoose.Promise = require("bluebird");

var Schema = mongoose.Schema;

var extNo = 0;

function WordCollection(ext) {
  var WordCollectionSchema =  new Schema({
    name: String
  }, { collection: 'letter_' + ext});

  extNo++;

  return mongoose.model(ext + extNo + 'WordCollection', WordCollectionSchema);
}

var WordSchema = new Schema({
  name: String
});

WordSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});

module.exports = {
  Word: mongoose.model('Word', WordSchema),
  WordCollection: WordCollection
};
