var mongoose = require('mongoose');

/*
job type - TA / RA / ISA / OA / Student Union / Dorms
*/

var jobSchema = mongoose.Schema({
   type: String,
   title : String,
   description : String,
   location : String,
   email : String,
   url: String,
   dateposted : String,
   departement : String,
   payrate : String,
   postedby : String,
   postedbydetails : {}
});

module.exports = jobSchema;
