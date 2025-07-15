
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "your-api-key-here"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export class WeatherAPI {
  static async getCurrentWeather(city) {
    try {
      const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)

      if (!response.ok) {
        throw new Error(`Weather data not found for ${city}`)
      }

      const data = await response.json()

      return {
        location: {
          name: data.name,
          country: data.sys.country,
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
        current: {
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          pressure: data.main.pressure,
          visibility: data.visibility ? Math.round(data.visibility / 1609.34) : 0, // Convert to miles
        },
      }
    } catch (error) {
      console.error("Error fetching current weather:", error)
      throw error
    }
  }

  static async getForecast(city) {
    try {
      const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)

      if (!response.ok) {
        throw new Error(`Forecast data not found for ${city}`)
      }

      const data = await response.json()

      // Group by day and get daily forecasts
      const dailyForecasts = {}

      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000)
        const dateKey = date.toDateString()

        if (!dailyForecasts[dateKey]) {
          dailyForecasts[dateKey] = []
        }
        dailyForecasts[dateKey].push(item)
      })

      return Object.entries(dailyForecasts)
        .slice(0, 5) // Get 5 days
        .map(([dateKey, dayData]) => {
          const temps = dayData.map((item) => item.main.temp)
          const high = Math.round(Math.max(...temps))
          const low = Math.round(Math.min(...temps))
          const mainWeather = dayData[0].weather[0]
          const date = new Date(dateKey)

          return {
            date: date.toISOString().split("T")[0],
            day: date.toLocaleDateString("en-US", { weekday: "long" }),
            high,
            low,
            condition: mainWeather.main,
            description: mainWeather.description,
            icon: mainWeather.icon,
            humidity: dayData[0].main.humidity,
            windSpeed: Math.round(dayData[0].wind.speed),
            precipitation: Math.round((dayData[0].pop || 0) * 100),
          }
        })
    } catch (error) {
      console.error("Error fetching forecast:", error)
      throw error
    }
  }

  static async getHourlyForecast(city) {
    try {
      const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)

      if (!response.ok) {
        throw new Error(`Hourly forecast not found for ${city}`)
      }

      const data = await response.json()

      return data.list.slice(0, 8).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        precipitation: Math.round((item.pop || 0) * 100),
      }))
    } catch (error) {
      console.error("Error fetching hourly forecast:", error)
      throw error
    }
  }

  static getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }
}
