const express = require("express");
const DB = require("./config/db");
const earthquakeRoutes = require("./routes/earthquakeRoutes");
const dotenv = require("dotenv");

dotenv.config(); // Çevresel değişkenleri yükler

const app = express();

// MongoDB bağlantısı

// JSON middleware
app.use(express.json());

// Rotalar
app.use("/api/earthquakes", earthquakeRoutes);

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
