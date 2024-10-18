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

const saveCountryandCity = async (req, res) => {
  try {
    const { cities, country } = req.body;

    // Önce veritabanında ülke var mı kontrol ediyoruz
    let existingCountry = await Country.findOne({ name: country.name });

    // Şehirlerin ObjectId'lerini tutacak dizi
    const cityIds = [];

    // Şehirleri kaydediyoruz
    for (const cityData of cities) {
      // Şehrin zaten var olup olmadığını kontrol et
      const existingCity = await City.findOne({ name: cityData.name });

      if (existingCity) {
        // Şehir zaten varsa ve mevcut ülkeye ait değilse, kaydetme ve devam et
        if (
          existingCountry &&
          existingCountry.cities.includes(existingCity._id)
        ) {
          console.log(
            `Şehir zaten mevcut ve ülkeye eklenmiş: ${cityData.name}`
          );
          continue; // Şehir zaten ülkeye eklenmişse atla
        }

        // Şehir mevcutsa ve ülkeye ekli değilse, sadece ID'yi ekle
        console.log(`Şehir mevcut, ancak ülkeye eklenmemiş: ${cityData.name}`);
        cityIds.push(existingCity._id);
        continue;
      }

      // Şehir yoksa, kaydet
      const city = new City(cityData);
      const savedCity = await city.save(); // Şehri kaydediyoruz
      cityIds.push(savedCity._id); // Kaydedilen şehrin ObjectId'sini diziye ekliyoruz
    }

    if (existingCountry) {
      // Ülke zaten varsa, yeni şehir ID'lerini ekliyoruz
      existingCountry.cities.push(...cityIds);

      // Tekrarlanan ID'leri kaldırıyoruz
      existingCountry.cities = [...new Set(existingCountry.cities)];
      await existingCountry.save(); // Ülkeyi güncelliyoruz
      res
        .status(200)
        .json({ message: "Ülke güncellendi", country: existingCountry });
    } else {
      // Ülke yoksa, yeni bir ülke kaydediyoruz
      const savedCountry = new Country({
        ...country,
        cities: cityIds, // Şehir ID'lerini ekliyoruz
      });
      await savedCountry.save();
      res.status(201).json({
        message: "Yeni ülke ve şehirler eklendi",
        country: savedCountry,
      });
    }
  } catch (error) {
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
};
