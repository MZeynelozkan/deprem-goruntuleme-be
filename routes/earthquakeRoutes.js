const express = require("express");
const earthquakeController = require("../controllers/earthquakeController");
const router = express.Router();

// POST: Yeni bir deprem kaydetme
router.post("/add", earthquakeController.addEarthquake);
router.post("/city", earthquakeController.addCity);
router.post("/country", earthquakeController.addCountry);

// GET: Şehre göre depremleri listeleme
router.get("/city/:city", earthquakeController.getEarthquakesByCity);

router.get("/country/:country", earthquakeController.getCountryWithCities);

router.get("/scale/:scale", earthquakeController.getEarthquakesByScale);

router.get("/cities/:country", earthquakeController.getCitiesByCountry);

// GET: Tüm depremleri listeleme
router.get("/all", earthquakeController.getAllEarthquakes);
router.get("/countries", earthquakeController.getCountries);

module.exports = router;
