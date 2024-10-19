const repoSpecial = require("../repositories/reposSpecial");

const saveCountryAndCities = async (countryData, citiesData) => {
  let existingCountry = await repoSpecial.findCountryByName(countryData.name);
  const cityIds = [];

  for (const cityData of citiesData) {
    const existingCity = await repoSpecial.findCityByName(cityData.name);

    if (existingCity) {
      if (
        existingCountry &&
        existingCountry.cities.includes(existingCity._id)
      ) {
        continue;
      }
      cityIds.push(existingCity._id);
    } else {
      const newCity = await repoSpecial.saveCity(cityData);
      cityIds.push(newCity._id);
    }
  }

  if (existingCountry) {
    existingCountry.cities.push(...cityIds);
    existingCountry.cities = [...new Set(existingCountry.cities)];
    return await repoSpecial.updateCountry(existingCountry);
  } else {
    const newCountry = {
      ...countryData,
      cities: cityIds,
    };
    return await repoSpecial.saveCountry(newCountry);
  }
};

module.exports = {
  saveCountryAndCities,
};
