
import { WeatherAPI } from "../lib/weather-api"
import "./WeatherCard.css"

const WeatherCard = ({ weatherData, hourlyForecast }) => {
  const { location, current } = weatherData

  return (
    <div className="weather-card-container">
      {/* Current Weather */}
      <div className="weather-card">
        <div className="weather-card-header">
          <h2 className="location-title">
            {location.name}, {location.country}
          </h2>
          <span className="condition-badge">{current.condition}</span>
        </div>

        <div className="weather-card-content">
          <div className="temperature-section">
            <div className="main-temp-display">
              <img
                src={WeatherAPI.getWeatherIconUrl(current.icon) || "/placeholder.svg"}
                alt={current.description}
                className="weather-icon-large"
              />
              <div className="temp-info">
                <div className="main-temperature">{current.temperature}°F</div>
                <div className="weather-description">{current.description}</div>
              </div>
            </div>
            <div className="feels-like">
              <span className="thermometer-icon">🌡️</span>
              <span>Feels like {current.feelsLike}°F</span>
            </div>
          </div>

          <div className="weather-details-grid">
            <div className="weather-detail-item">
              <span className="detail-icon">💧</span>
              <div className="detail-info">
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{current.humidity}%</div>
              </div>
            </div>
            <div className="weather-detail-item">
              <span className="detail-icon">💨</span>
              <div className="detail-info">
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">{current.windSpeed} mph</div>
              </div>
            </div>
            <div className="weather-detail-item">
              <span className="detail-icon">👁️</span>
              <div className="detail-info">
                <div className="detail-label">Visibility</div>
                <div className="detail-value">{current.visibility} mi</div>
              </div>
            </div>
            <div className="weather-detail-item">
              <span className="detail-icon">📊</span>
              <div className="detail-info">
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{current.pressure} hPa</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      {hourlyForecast && hourlyForecast.length > 0 && (
        <div className="hourly-forecast-card">
          <h3 className="forecast-title">Hourly Forecast</h3>
          <div className="hourly-forecast-container">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourly-item">
                <div className="hourly-time">{hour.time}</div>
                <img
                  src={WeatherAPI.getWeatherIconUrl(hour.icon) || "/placeholder.svg"}
                  alt={hour.condition}
                  className="hourly-icon"
                />
                <div className="hourly-temp">{hour.temperature}°</div>
                <div className="hourly-precipitation">
                  <span className="precipitation-icon">💧</span>
                  {hour.precipitation}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherCard
