var mongoose = require('mongoose');

var communitySchema = mongoose.Schema({
   name : String,
   address : String,
   url : String,
   communityRepresentative : {}, // user object should be sent here
  // services : [] // array of json objects of selected services to be allowed
});

module.exports = communitySchema;
