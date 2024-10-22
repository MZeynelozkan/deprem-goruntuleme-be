const Earthquake = require("../models/earthquake");
const City = require("../models/cityModel");
const Country = require("../models/countryModel");

// Deprem verilerini kaydetme
const saveEarthquake = async (earthquakeData) => {
  const earthquake = new Earthquake(earthquakeData);
  return await earthquake.save();
};

const saveCountryAndCities = async (countryData, cityData) => {
  const city = new City(cityData);
  const country = new Country({ ...countryData, cities: [city._id] });
  await country.save();
  await city.save();
};

const getEarthquakesById = async (id) => {
  return await City.findById(id).select("recentEarthquakes");
};

const deleteRecentEarthquakeById = async (cityId, earthquakeId) => {
  return await City.findByIdAndUpdate(
    cityId,
    { $pull: { recentEarthquakes: { _id: earthquakeId } } }, // Belirli bir depremin _id'sine göre çekip sil
    { new: true } // Güncellenmiş dokümanı döndür
  );
};

// Belirli bir şehirdeki depremleri bulma
const findEarthquakesByCity = async (city) => {
  return await Earthquake.find({ city });
};

const findCityAndUpdate = async (cityId, updateData) => {
  try {
    return await City.findOneAndUpdate(
      { _id: cityId },
      { $set: updateData },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating city:", error);
    throw new Error("Failed to update city.");
  }
};

// Tüm depremleri listeleme
const findAllEarthquakes = async () => {
  return await Earthquake.find();
};

const getAllCities = async () => {
  return await City.find({});
};

const findEarthquakesByCountry = async (country) => {
  try {
    return await Earthquake.find({ country: country });
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    throw error; // Hatanın üst katmana fırlatılması
  }
};

const findEarthquakesByScale = async (scale) => {
  try {
    return await Earthquake.find({ magnitude: { $gte: scale } });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  saveEarthquake,
  findEarthquakesByCity,
  findAllEarthquakes,
  findEarthquakesByCountry,
  findEarthquakesByScale,
  getAllCities,
  saveCountryAndCities,
  findCityAndUpdate,
  getEarthquakesById,
  deleteRecentEarthquakeById,
};
