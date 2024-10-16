const mongoose = require("mongoose");

const EarthquakeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  magnitude: { type: Number, required: true },
  depth: { type: Number, required: true },
});

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  recentEarthquakes: [EarthquakeSchema], // Depremleri şehirde listele
});

const City = mongoose.model("City", CitySchema);
module.exports = City;
