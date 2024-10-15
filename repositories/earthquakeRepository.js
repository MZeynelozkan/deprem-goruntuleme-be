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

const findEarthquakesByCountry = async (country) => {
  try {
    return await Earthquake.find({ country: country });
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    throw error; // Hatanın üst katmana fırlatılması
  }
};

module.exports = {
  saveEarthquake,
  findEarthquakesByCity,
  findAllEarthquakes,
  findEarthquakesByCountry,
};
