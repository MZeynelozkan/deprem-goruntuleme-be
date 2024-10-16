const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Singleton Deseni

class DB {
  static _instance = null;
  _DB_CONNECTION = null;

  constructor() {
    if (DB._instance) {
      return DB._instance;
    }

    this._DB_CONNECTION = this.connectDB();

    DB._instance = this;
    return this;
  }

  async connectDB() {
    if (!this._DB_CONNECTION) {
      try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB başarıyla bağlandı.");
        return mongoose.connection.readyState === 1;
      } catch (error) {
        console.error("MongoDB bağlantı hatası:", error.message);
        process.exit(1);
      }
    }
    return this._DB_CONNECTION;
  }

  DB_INSTANCE() {
    // Bağlantının tamamlanmasını bekle
    return this._DB_CONNECTION;
  }
}

module.exports = new DB();
