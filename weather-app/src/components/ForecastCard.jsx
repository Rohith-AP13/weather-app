
import { WeatherAPI } from "../lib/weather-api"
import "./ForecastCard.css"

const ForecastCard = ({ forecastData }) => {
  if (!forecastData || forecastData.length === 0) {
    return null
  }

  return (
    <div className="forecast-card">
      <h3 className="forecast-card-title">5-Day Forecast</h3>
      <div className="forecast-list">
        {forecastData.map((day, index) => (
          <div key={day.date} className="forecast-item">
            <div className="forecast-day-info">
              <div className="day-name">{index === 0 ? "Today" : day.day}</div>
              <div className="day-date">
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <img
              src={WeatherAPI.getWeatherIconUrl(day.icon) || "/placeholder.svg"}
              alt={day.description}
              className="forecast-icon"
            />

            <div className="forecast-details">
              <div className="forecast-condition">{day.description}</div>
              <div className="forecast-stats">
                <span className="forecast-stat">
                  <span className="stat-icon">💧</span>
                  {day.precipitation}%
                </span>
                <span className="forecast-stat">
                  <span className="stat-icon">💨</span>
                  {day.windSpeed} mph
                </span>
              </div>
            </div>

            <div className="forecast-temps">
              <div className="temp-high">{day.high}°</div>
              <div className="temp-low">{day.low}°</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastCard
