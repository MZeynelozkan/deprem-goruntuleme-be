const express = require("express");
const earthquakeController = require("../controllers/earthquakeController");
const router = express.Router();

// POST: Yeni bir deprem kaydetme
router.post("/add", earthquakeController.addEarthquake);

// GET: Şehre göre depremleri listeleme
router.get("/city/:city", earthquakeController.getEarthquakesByCity);

// GET: Tüm depremleri listeleme
router.get("/all", earthquakeController.getAllEarthquakes);

module.exports = router;
