const City = require("../models/cityModel");
const Country = require("../models/countryModel");
const earthquakeRepository = require("../repositories/earthquakeRepository");

// Deprem verisi ekleme
const addEarthquake = async (earthquakeData) => {
  if (
    !earthquakeData.city ||
    !earthquakeData.magnitude ||
    !earthquakeData.date
  ) {
    throw new Error("Eksik deprem bilgisi!");
  }

  // Deprem büyüklüğüne göre bir mantık ekleyebiliriz
  if (earthquakeData.magnitude > 5.0) {
    console.log("Büyük bir deprem kaydedildi!");
  }

  return await earthquakeRepository.saveEarthquake(earthquakeData);
};

const saveCountryAndCities = async (countryData, cityData) => {
  return await earthquakeRepository.saveCountryAndCities(countryData, cityData);
};

// Şehre göre depremleri listeleme
const getEarthquakesByCity = async (city) => {
  if (!city) {
    throw new Error("Şehir adı gerekli");
  }

  return await earthquakeRepository.findEarthquakesByCity(city);
};

// Tüm depremleri listeleme
const getAllEarthquakes = async () => {
  return await earthquakeRepository.findAllEarthquakes();
};

const getEarthquakesByScale = async (scale) => {
  if (!scale) {
    throw new Error("Buyukluk Gerekli");
  }
  return await earthquakeRepository.findEarthquakesByScale(scale);
};

const getAllCities = async () => {
  return await earthquakeRepository.getAllCities();
};

// Ülkeye göre depremleri listeleme
const getCitiesByCountry = async (country) => {
  if (!country) {
    throw new Error("Ülke adı gerekli");
  }

  try {
    return await earthquakeRepository.findEarthquakesByCountry(country);
  } catch (error) {
    console.error("Veri çekme hatası:", error); // Hatanın konsola yazdırılması
    throw error; // Hatanın üst katmana fırlatılması
  }
};

const addCity = async ({
  name,
  location,
  recentEarthquakes: { date, magnitude, depth },
}) => {
  const city = new City({
    name,
    location,
    recentEarthquakes: [
      {
        date,
        magnitude,
        depth,
      },
    ],
  });

  await city.save();

  return city._id; // save asenkron olduğu için Promise döner
};

const addCountry = async (cityId) => {
  const country = new Country({
    name: "Türkiye",
    averageLocation: { latitude: 39.9334, longitude: 32.8597 },
    cities: [cityId], // İstanbul şehrini ekle
  });
  await country.save();
};

const getCountries = async () => {
  return await Country.find();
};

module.exports = {
  addEarthquake,
  getEarthquakesByCity,
  getAllEarthquakes,
  getCitiesByCountry,
  getEarthquakesByScale,
  addCity,
  addCountry,
  getCountries,
  getAllCities,
  saveCountryAndCities,
};
