const City = require("../models/cityModel");
const Country = require("../models/countryModel");

const findCountryByName = async (name) => {
  return await Country.findOne({ name });
};

const findCityByName = async (name) => {
  return await City.findOne({ name });
};

const saveCity = async (cityData) => {
  const city = new City(cityData);
  return await city.save();
};

const saveCountry = async (countryData) => {
  const country = new Country(countryData);
  return await country.save();
};

const updateCountry = async (country) => {
  return await country.save();
};

module.exports = {
  findCountryByName,
  findCityByName,
  saveCity,
  saveCountry,
  updateCountry,
};
