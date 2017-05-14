var mongoose = require('mongoose');

var serviceSchema = mongoose.Schema({
   title : String,
   description : String,
   status : Boolean,
   url : String,
   servicesprovided : String,
   // createdBy : {}
});

module.exports = serviceSchema;
