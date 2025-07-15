
"use client"

import { useState, useEffect } from "react"
import SearchBox from "./components/SearchBox"
import WeatherCard from "./components/WeatherCard"
import ForecastCard from "./components/ForecastCard"
import { WeatherAPI } from "./lib/weather-api"
import "./App.css"

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [hourlyForecast, setHourlyForecast] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load default city on component mount
  useEffect(() => {
    handleSearch("New York")
  }, [])

  const handleSearch = async (city) => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch all weather data concurrently
      const [currentWeather, forecast, hourly] = await Promise.all([
        WeatherAPI.getCurrentWeather(city),
        WeatherAPI.getForecast(city),
        WeatherAPI.getHourlyForecast(city),
      ])

      setWeatherData(currentWeather)
      setForecastData(forecast)
      setHourlyForecast(hourly)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      console.error("Weather fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="app-container">
        {/* Search Box */}
        <SearchBox
          onSearch={handleSearch}
          isLoading={isLoading}
          currentLocation={weatherData ? `${weatherData.location.name}, ${weatherData.location.country}` : undefined}
        />

        {/* Error Display */}
        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading weather data...</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !isLoading && (
          <>
            <WeatherCard weatherData={weatherData} hourlyForecast={hourlyForecast} />
            <ForecastCard forecastData={forecastData} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
