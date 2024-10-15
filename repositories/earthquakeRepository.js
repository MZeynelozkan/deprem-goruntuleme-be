const Earthquake = require("../models/earthquake");

// Deprem verilerini kaydetme
const saveEarthquake = async (earthquakeData) => {
  const earthquake = new Earthquake(earthquakeData);
  return await earthquake.save();
};

// Belirli bir şehirdeki depremleri bulma
const findEarthquakesByCity = async (city) => {
  return await Earthquake.find({ city });
};

// Tüm depremleri listeleme
const findAllEarthquakes = async () => {
  return await Earthquake.find();
};

module.exports = {
  saveEarthquake,
  findEarthquakesByCity,
  findAllEarthquakes,
};
