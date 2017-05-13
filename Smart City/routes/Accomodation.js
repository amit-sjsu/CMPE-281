var mongoose = require('mongoose');

var accomodationSchema = mongoose.Schema({
  type : String,
  vacancies : 0,
  preference : String,
  startdate : String,
  facilities : String,
  apartment : String,
  address : String,
  lattitude : String,
  longitude : String,
  contact : String,
  rent : String,
  postedby : String,
  postedbydetails : {}
});

module.exports = accomodationSchema;
