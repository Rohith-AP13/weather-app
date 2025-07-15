
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY

// Helper: demo data when no API key is present (so the preview still works)
const demoWeather = {
  location: { name: "Demo City", country: "XX", lat: 0, lon: 0 },
  current: {
    temperature: 72,
    feelsLike: 74,
    condition: "Clear",
    description: "clear sky",
    icon: "01d",
    humidity: 50,
    windSpeed: 5,
    pressure: 1015,
    visibility: 10,
  },
}
const demoForecast = [
  {
    date: "2025-07-16",
    day: "Wednesday",
    high: 75,
    low: 60,
    condition: "Clear",
    description: "clear sky",
    icon: "01d",
    humidity: 55,
    windSpeed: 6,
    precipitation: 0,
  },
  {
    date: "2025-07-17",
    day: "Thursday",
    high: 78,
    low: 62,
    condition: "Clouds",
    description: "few clouds",
    icon: "02d",
    humidity: 60,
    windSpeed: 7,
    precipitation: 10,
  },
  {
    date: "2025-07-18",
    day: "Friday",
    high: 80,
    low: 65,
    condition: "Rain",
    description: "light rain",
    icon: "10d",
    humidity: 70,
    windSpeed: 8,
    precipitation: 50,
  },
  {
    date: "2025-07-19",
    day: "Saturday",
    high: 70,
    low: 58,
    condition: "Clear",
    description: "clear sky",
    icon: "01d",
    humidity: 50,
    windSpeed: 5,
    precipitation: 0,
  },
  {
    date: "2025-07-20",
    day: "Sunday",
    high: 73,
    low: 60,
    condition: "Clouds",
    description: "overcast clouds",
    icon: "04d",
    humidity: 65,
    windSpeed: 7,
    precipitation: 20,
  },
]
const demoHourlyForecast = [
  { time: "1 PM", temperature: 72, condition: "Clear", icon: "01d", precipitation: 0 },
  { time: "2 PM", temperature: 73, condition: "Clear", icon: "01d", precipitation: 0 },
  { time: "3 PM", temperature: 74, condition: "Clouds", icon: "02d", precipitation: 0 },
  { time: "4 PM", temperature: 73, condition: "Clouds", icon: "02d", precipitation: 0 },
  { time: "5 PM", temperature: 72, condition: "Clouds", icon: "03d", precipitation: 10 },
  { time: "6 PM", temperature: 70, condition: "Rain", icon: "10d", precipitation: 30 },
  { time: "7 PM", temperature: 68, condition: "Rain", icon: "10n", precipitation: 50 },
  { time: "8 PM", temperature: 66, condition: "Clear", icon: "01n", precipitation: 0 },
]

const BASE_URL = "https://api.openweathermap.org/data/2.5"

export class WeatherAPI {
  static async getCurrentWeather(city) {
    try {
      if (!API_KEY) {
        console.warn("⚠️  REACT_APP_OPENWEATHER_API_KEY is missing – using mock data.")
        return demoWeather
      }
      const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)

      if (!response.ok) {
        const { message } = await response.json().catch(() => ({}))
        /* OpenWeatherMap returns:
           401 – bad / missing key
           404 – city not found
        */
        throw new Error(`OpenWeather error ${response.status}: ${message || "Unable to fetch data"}`)
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
    if (!API_KEY) return demoForecast
    try {
      const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)

      if (!response.ok) {
        const { message } = await response.json().catch(() => ({}))
        throw new Error(`OpenWeather error ${response.status}: ${message || "Unable to fetch data"}`)
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
    if (!API_KEY) return demoHourlyForecast
    try {
      const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`)

      if (!response.ok) {
        const { message } = await response.json().catch(() => ({}))
        throw new Error(`OpenWeather error ${response.status}: ${message || "Unable to fetch data"}`)
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
