"use client"

import { useState } from "react"
import "./SearchBox.css"

const SearchBox = ({ onSearch, isLoading = false, currentLocation }) => {
  const [query, setQuery] = useState("")
  const [suggestions] = useState([
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setQuery("")
    }
  }

  const handleSuggestionClick = (city) => {
    onSearch(city)
    setQuery("")
  }

  return (
    <div className="search-box">
      <div className="search-content">
        <div className="search-header">
          <h1 className="search-title">Weather Forecast</h1>
          {currentLocation && (
            <div className="current-location">
              <span className="location-icon">📍</span>
              <span className="location-text">Currently showing: {currentLocation}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Enter city name (e.g., New York, London, Tokyo)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading || !query.trim()} className="search-button">
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="suggestions-grid">
          {suggestions.map((city) => (
            <button
              key={city}
              onClick={() => handleSuggestionClick(city)}
              className="suggestion-button"
              disabled={isLoading}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchBox
