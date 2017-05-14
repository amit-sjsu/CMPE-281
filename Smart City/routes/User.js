var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
   name : String,
   address : String,
   email : String,
   phone : String,
   password : String,
   community : {},
   servivces : []

});

/* name, email, add, phone, password, communityName, services*/
module.exports = userSchema;
