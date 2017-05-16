var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  message : String,
  to : String,
  from : String,
  sentdate : String
});

module.exports = messageSchema;
