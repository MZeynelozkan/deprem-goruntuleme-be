const express = require("express");
const earthquakeService = require("../services/earthquakeService");
const { get } = require("mongoose");
const City = require("../models/cityModel");
const Country = require("../models/countryModel");

// Yeni deprem ekleme
const addEarthquake = async (req, res) => {
  try {
    const earthquakeData = req.body;
    const savedEarthquake = await earthquakeService.addEarthquake(
      earthquakeData
    );
    res.status(201).json(savedEarthquake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEarthquakesById = async (req, res) => {
  try {
    const id = req.params.id;
    const earthquake = await earthquakeService.getEarthquakesById(id);
    res.status(200).json(earthquake);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteRecentEarthquakeById = async (req, res) => {
  try {
    console.log(req.params);
    const cityId = req.params.cityId;
    const earthquakeId = req.params.earthquakeId;
    const deletedEarthquake =
      await earthquakeService.deleteRecentEarthquakeById(cityId, earthquakeId);
    res.status(200).json(deletedEarthquake);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const findCityAndUpdate = async (req, res) => {
  try {
    const { city, update } = req.body;

    if (!city || !update) {
      return res
        .status(400)
        .json({ message: "Both city ID and update data must be provided." });
    }

    const updatedCity = await earthquakeService.findCityAndUpdate(city, {
      recentEarthquakes: update,
    });

    res.status(200).json(updatedCity);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const saveCountryandCity = async (req, res) => {
  try {
    const { cities, country } = req.body;

    console.log("Received data:", req.body); // Gelen veriyi kontrol et

    let existingCountry = await Country.findOne({ name: country.name });
    console.log("Existing country:", existingCountry); // Ülke mevcut mu kontrol et

    const cityIds = [];

    for (const cityData of cities) {
      const existingCity = await City.findOne({ name: cityData.name });

      if (existingCity) {
        if (
          existingCountry &&
          existingCountry.cities.includes(existingCity._id)
        ) {
          console.log(
            `Şehir zaten mevcut ve ülkeye eklenmiş: ${cityData.name}`
          );
          continue;
        }

        console.log(`Şehir mevcut, ancak ülkeye eklenmemiş: ${cityData.name}`);
        cityIds.push(existingCity._id);
        continue;
      }

      const city = new City(cityData);
      const savedCity = await city.save();
      console.log(`Yeni şehir kaydedildi: ${savedCity.name}`);
      cityIds.push(savedCity._id);
    }

    if (existingCountry) {
      existingCountry.cities.push(...cityIds);
      existingCountry.cities = [...new Set(existingCountry.cities)];
      await existingCountry.save();
      console.log(`Ülke güncellendi: ${existingCountry.name}`);
      res
        .status(200)
        .json({ message: "Ülke güncellendi", country: existingCountry });
    } else {
      const savedCountry = new Country({
        ...country,
        cities: cityIds,
      });
      await savedCountry.save();
      console.log(`Yeni ülke ve şehirler eklendi: ${savedCountry.name}`);
      res.status(201).json({
        message: "Yeni ülke ve şehirler eklendi",
        country: savedCountry,
      });
    }
  } catch (error) {
    console.error("Hata oluştu:", error.message); // Hata mesajını logla
    res.status(400).json({ message: error.message });
  }
};

const getAllCities = async (req, res) => {
  try {
    const cities = await earthquakeService.getAllCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getCountries = async (req, res) => {
  try {
    const countries = await earthquakeService.getCountries();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Şehre göre depremleri listeleme
const getEarthquakesByCity = async (req, res) => {
  try {
    const city = req.params.city;
    const earthquakes = await earthquakeService.getEarthquakesByCity(city);
    res.status(200).json(earthquakes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Tüm depremleri listeleme
const getAllEarthquakes = async (req, res) => {
  try {
    const earthquakes = await earthquakeService.getAllEarthquakes();
    res.status(200).json(earthquakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEarthquakesByScale = async (req, res) => {
  try {
    const scale = req.params.scale;
    const earthquakes = await earthquakeService.getEarthquakesByScale(scale);
    res.status(200).json(earthquakes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCitiesByCountry = async (req, res) => {
  const country = req.params.country;

  try {
    const cities = await earthquakeService.getCitiesByCountry(country);
    if (cities.length === 0) {
      return res
        .status(404)
        .json({ message: "No cities found for this country." });
    }
    res.json(cities);
  } catch (error) {
    console.error("Hata:", error); // Hatanın konsola yazdırılması
    res.status(500).json({
      message: "An error occurred while fetching cities.",
      error: error.message,
    });
  }
};

const addCity = async (req, res) => {
  try {
    const city = req.body;
    const savedCity = await City.create(city);
    res.status(201).json(savedCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCountry = async (req, res) => {
  try {
    const country = req.body;
    const savedCountry = await Country.create(country);
    res.status(201).json(savedCountry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCountryWithCities = async (req, res) => {
  try {
    const { country } = req.params; // Extract 'country' from request params
    const countryData = await Country.findOne({ name: country }).populate(
      "cities"
    ); // Use 'name' to query the country
    if (!countryData) {
      return res.status(404).json({ message: "Country not found" });
    }
    return res.status(200).json(countryData);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addEarthquake,
  getEarthquakesByCity,
  getAllEarthquakes,
  getCitiesByCountry,
  getEarthquakesByScale,
  addCountry,
  addCity,
  getCountryWithCities,
  getCountries,
  getAllCities,
  saveCountryandCity,
  findCityAndUpdate,
  getEarthquakesById,
  deleteRecentEarthquakeById,
};
