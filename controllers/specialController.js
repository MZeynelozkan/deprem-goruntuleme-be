const serviceSpacial = require("../services/serviceSpeacial");

const saveCountryAndCity = async (req, res) => {
  try {
    const { cities, country } = req.body;
    const result = await serviceSpacial.saveCountryAndCities(country, cities);
    res.status(201).json({
      message: result
        ? "Ülke ve şehirler başarıyla kaydedildi."
        : "Ülke güncellendi.",
      country: result,
    });
  } catch (error) {
    console.error("Hata oluştu:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  saveCountryAndCity,
};
