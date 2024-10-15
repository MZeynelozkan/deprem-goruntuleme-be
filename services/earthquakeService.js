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

module.exports = {
  addEarthquake,
  getEarthquakesByCity,
  getAllEarthquakes,
};
