var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    title : String,
    description : String,
    location : String,
    website : String,
    free_stuffs : [],
    date : String,
    entryfees : 0
});

module.exports = eventSchema;
