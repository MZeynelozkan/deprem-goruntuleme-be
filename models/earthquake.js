const mongoose = require("mongoose");

const earthquakeSchema = new mongoose.Schema({
  country: String,
  city: String,
  date: Date,
  magnitude: Number,
  depth: Number,
  epicenter: {
    lat: Number,
    lng: Number,
  },
});

module.exports = mongoose.model("Earthquake", earthquakeSchema);
