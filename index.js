const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// MongoDB'ye bağlanma
const dbURI = process.env.MONGO_URI; // Kendi MongoDB bağlantı URI'nızı yazın
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB bağlantısı başarılı!"))
  .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// Modelleri içe aktarma
const City = require("./models/cityModel"); // Şehir modeli
const Country = require("./models/countryModel"); // Ülke modeli

// OpenCage API anahtarı
const API_KEY = "996fbb96fbda406c9d0a6d80b28835d7"; // .env dosyasına taşındı

// Reverse geocoding işlemi
async function getCityAndCountry(latitude, longitude) {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`;

  console.log(
    `Fetching city and country for latitude: ${latitude}, longitude: ${longitude}`
  );

  try {
    const response = await axios.get(url);
    console.log("API Response:", response.data); // API yanıtını kontrol et

    const data = response.data;

    if (data && data.features && data.features.length > 0) {
      const result = data.features[0].properties; // Özellikleri almak için
      console.log("result", result);
      const city = result.city || result.name; // result.city boşsa, result.name kullan
      const country = result.country;

      console.log(`Detected city: ${city}, country: ${country}`); // Şehir ve ülke bilgilerini logla

      return { city, country };
    } else {
      console.log("No results found in the API response");
      return { city: null, country: null };
    }
  } catch (error) {
    console.error("Reverse geocoding hatası:", error);
    return { city: null, country: null };
  }
}

// JSON dosyasını okuma
const jsonData = fs.readFileSync("earthquakes1970-2014.json", "utf8"); // Dosya adınızı girin
const earthquakeData = JSON.parse(jsonData);

// Tüm deprem verilerini işleyip MongoDB'ye kaydetme
async function processEarthquakeData() {
  for (const data of earthquakeData["features"]) {
    // Veriyi string olarak yazdır

    console.log("Veri kontrol ediliyor:", JSON.stringify(data, null, 2));

    // Her bir feature'ı işle
    const { properties } = data;

    // Latitude ve Longitude'u properties'den alın
    const { DateTime, Depth, Magnitude, Latitude, Longitude } = properties;

    console.log("Earthquake data:", {
      Latitude,
      Longitude,
      DateTime,
      Depth,
      Magnitude,
    }); // Deprem verisini logla

    const { city, country } = await getCityAndCountry(Latitude, Longitude);

    if (city && country) {
      let cityDoc = await City.findOne({ name: city });

      if (!cityDoc) {
        cityDoc = new City({
          name: city,
          location: { latitude: Latitude, longitude: Longitude },
          recentEarthquakes: [],
        });
        await cityDoc.save();
      }

      cityDoc.recentEarthquakes.push({
        date: new Date(DateTime),
        magnitude: Magnitude,
        depth: Depth,
      });
      await cityDoc.save();

      let countryDoc = await Country.findOne({ name: country });

      if (!countryDoc) {
        countryDoc = new Country({
          name: country,
          averageLocation: { latitude: Latitude, longitude: Longitude },
          cities: [cityDoc._id],
        });
        await countryDoc.save();
      } else if (!countryDoc.cities.includes(cityDoc._id)) {
        countryDoc.cities.push(cityDoc._id);
        await countryDoc.save();
      }

      console.log(`Deprem verisi kaydedildi: ${city}, ${country}`);
    } else {
      console.log(
        `Şehir veya ülke bilgisi bulunamadı. (Şehir: ${city}, Ülke: ${country})`
      );
    }
  }
}

// Deprem verilerini işleme fonksiyonunu çağırın
processEarthquakeData()
  .then(() => {
    console.log("Tüm deprem verileri işlendi.");
  })
  .catch((err) => {
    console.error("Bir hata oluştu:", err);
  });

//   const mongoose = require("mongoose");
// const fs = require("fs");
// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config();

// // MongoDB'ye bağlanma
// const dbURI = process.env.MONGO_URI;
// mongoose
//   .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB bağlantısı başarılı!"))
//   .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// // Modelleri içe aktarma
// const City = require("./models/cityModel");
// const Country = require("./models/countryModel");

// // OpenCage API anahtarı
// const API_KEY = process.env.GEOAPIFY_API_KEY;

// // Reverse geocoding işlemi
// async function getCityAndCountry(latitude, longitude) {
//   const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`;

//   try {
//     const response = await axios.get(url);
//     const data = response.data;

//     if (data && data.features && data.features.length > 0) {
//       const result = data.features[0].properties;
//       const city = result.city || result.name;
//       const country = result.country;
//       return { city, country };
//     } else {
//       return { city: null, country: null };
//     }
//   } catch (error) {
//     console.error("Reverse geocoding hatası:", error);
//     return { city: null, country: null };
//   }
// }

// // JSON dosyasını okuma
// const jsonData = fs.readFileSync("earthquakes1970-2014.json", "utf8");
// const earthquakeData = JSON.parse(jsonData);

// // Tüm deprem verilerini işleyip MongoDB'ye kaydetme
// async function processEarthquakeData() {
//   for (const data of earthquakeData.features) {
//     // properties ve geometry alanlarını kontrol edin
//     if (!data.properties || !data.geometry) {
//       console.warn("Eksik veri: properties veya geometry tanımlı değil.", data);
//       continue;
//     }

//     const { properties, geometry } = data;
//     const [Longitude, Latitude] = geometry.coordinates.slice(0, 2); // İlk iki değeri al

//     const { mag: Magnitude, time, title } = properties;
//     const DateTime = new Date(time); // Zamanı UTC'ye dönüştür

//     const { city, country } = await getCityAndCountry(Latitude, Longitude);

//     if (city && country) {
//       let cityDoc = await City.findOne({ name: city });
//       if (!cityDoc) {
//         cityDoc = new City({
//           name: city,
//           location: { latitude: Latitude, longitude: Longitude },
//           recentEarthquakes: [],
//         });
//         await cityDoc.save();
//       }

//       cityDoc.recentEarthquakes.push({
//         date: DateTime,
//         magnitude: Magnitude,
//         depth: geometry.coordinates[2] || null, // Derinlik üçüncü öğe olarak alınıyor
//       });
//       await cityDoc.save();

//       let countryDoc = await Country.findOne({ name: country });
//       if (!countryDoc) {
//         countryDoc = new Country({
//           name: country,
//           averageLocation: { latitude: Latitude, longitude: Longitude },
//           cities: [cityDoc._id],
//         });
//         await countryDoc.save();
//       } else if (!countryDoc.cities.includes(cityDoc._id)) {
//         countryDoc.cities.push(cityDoc._id);
//         await countryDoc.save();
//       }

//       console.log(`Deprem verisi kaydedildi: ${title}`);
//     } else {
//       console.log(
//         `Şehir veya ülke bilgisi bulunamadı. (Şehir: ${city}, Ülke: ${country})`
//       );
//     }
//   }
// }

// // Deprem verilerini işleme fonksiyonunu çağırın
// processEarthquakeData()
//   .then(() => {
//     console.log("Tüm deprem verileri işlendi.");
//   })
//   .catch((err) => {
//     console.error("Bir hata oluştu:", err);
//   });
