var mongoose = require('mongoose');

var announcementSchema = mongoose.Schema({
  message : String, 
  date : String
});

module.exports = announcementSchema;
