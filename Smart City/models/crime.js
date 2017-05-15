var mongoose = require('mongoose');

var crimeSchema = mongoose.Schema({
   title : String,
   description : String,
   suspect:String,
   dateandtime : String,
   severity : String,
   location : String,
   dateposted : String,
   postedby : String,
   postedbydetails : {}
});

module.exports = crimeSchema;
