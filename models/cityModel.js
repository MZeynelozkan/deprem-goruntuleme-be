const mongoose = require("mongoose");

const EarthquakeSchema = new mongoose.Schema({
  date: { type: Date },
  magnitude: { type: Number },
  depth: { type: Number },
});


const City = mongoose.model("City", CitySchema);
module.exports = City;
