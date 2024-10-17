const express = require("express");
const DB = require("./config/db");
const earthquakeRoutes = require("./routes/earthquakeRoutes");
const dotenv = require("dotenv");
const morganMiddleware = require("./middlewares/middlewares");

dotenv.config();

const app = express();

// JSON middleware
app.use(express.json());
app.use(morganMiddleware);

// Rotalar
app.use("/api/earthquakes", earthquakeRoutes);

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
