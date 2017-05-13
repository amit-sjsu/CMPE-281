var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username : String,
  user_emailid : String,
  user_password : String,
  user_profilepicture_url : String,
  user_degree : String,
  user_major : String
});

module.exports = userSchema;
