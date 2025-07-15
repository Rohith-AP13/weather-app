
// TypeScript interfaces converted to JSDoc for better IDE support

/**
 * @typedef {Object} WeatherLocation
 * @property {string} name
 * @property {string} country
 * @property {number} lat
 * @property {number} lon
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {number} temperature
 * @property {number} feelsLike
 * @property {string} condition
 * @property {string} description
 * @property {string} icon
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {number} pressure
 * @property {number} visibility
 * @property {number} [uvIndex]
 */

/**
 * @typedef {Object} WeatherData
 * @property {WeatherLocation} location
 * @property {CurrentWeather} current
 */

/**
 * @typedef {Object} ForecastData
 * @property {string} date
 * @property {string} day
 * @property {number} high
 * @property {number} low
 * @property {string} condition
 * @property {string} description
 * @property {string} icon
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {number} precipitation
 */

/**
 * @typedef {Object} HourlyForecast
 * @property {string} time
 * @property {number} temperature
 * @property {string} condition
 * @property {string} icon
 * @property {number} precipitation
 */

export {}
