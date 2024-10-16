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

const getCountryWithCities = async ({ name }) => {
  try {
    const country = await Country.findOne({ name }).populate("cities");
  } catch (error) {
    console.log(error.message);
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
};
