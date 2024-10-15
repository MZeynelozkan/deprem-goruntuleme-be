const express = require("express");
const earthquakeService = require("../services/earthquakeService");

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

module.exports = {
  addEarthquake,
  getEarthquakesByCity,
  getAllEarthquakes,
};
