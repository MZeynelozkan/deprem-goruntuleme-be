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

async function getAllEarthquakesWithCityName() {
  try {
    // Ülkeleri şehirleriyle birlikte getir
    const countries = await Country.find({})
      .populate({
        path: "cities", // Şehirleri dahil et
        select: "name recentEarthquakes", // Şehirlerin isimlerini ve recentEarthquakes'lerini al
      })
      .exec();

    // Tüm depremleri birleştir
    let allEarthquakes = [];

    countries.forEach((country) => {
      country.cities.forEach((city) => {
        city.recentEarthquakes.forEach((earthquake) => {
          allEarthquakes.push({
            cityName: city.name,
            ...earthquake.toObject(), // Deprem bilgilerini al, cityName ile birleştir
          });
        });
      });
    });

    // Depremleri tarihe göre (en son eklenene göre) sırala
    allEarthquakes.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(allEarthquakes);
    return allEarthquakes;
  } catch (error) {
    console.error("Error fetching earthquakes:", error);
  }
}

async function getAverageEarthquakeData() {
  try {
    const results = await City.aggregate([
      {
        $unwind: "$recentEarthquakes", // recentEarthquakes dizisini düzleştir
      },
      {
        $group: {
          _id: null, // Gruplama yapılmayacak, tüm veriler birleştirilecek
          totalMagnitude: { $sum: "$recentEarthquakes.magnitude" }, // Toplam büyüklüğü hesapla
          totalDepth: { $sum: "$recentEarthquakes.depth" }, // Toplam derinliği hesapla
          totalEarthquakes: { $sum: 1 }, // Toplam deprem sayısını hesapla
        },
      },
      {
        $project: {
          _id: 0, // _id'yi gizle
          averageMagnitude: {
            $divide: ["$totalMagnitude", "$totalEarthquakes"],
          }, // Ortalama büyüklüğü hesapla
          averageDepth: { $divide: ["$totalDepth", "$totalEarthquakes"] }, // Ortalama derinliği hesapla
          totalEarthquakes: 1, // Toplam deprem sayısını ekle
        },
      },
    ]);

    console.log(results); // Sonuçları konsola yazdır
    return results; // Sonuçları döndür
  } catch (error) {
    console.error("Error fetching overall average earthquake data:", error);
  }
}

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
  getAllEarthquakesWithCityName,
  getAverageEarthquakeData,
};
