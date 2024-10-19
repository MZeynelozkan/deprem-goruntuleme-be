const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  averageLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }], // Şehirleri referans al
});

const Country = mongoose.model("Country", CountrySchema);
module.exports = Country;
