import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, fetchForecast } from "./app/features/weather/weatherSlice";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [inputError, setInputError] = useState("");

  const dispatch = useDispatch();

  const { data, forecast, loading, error } = useSelector(
    (state) => state.weather
  );

  const handleSearch = () => {
    const trimmedCity = city.trim();

    // ❌ Invalid input
    if (!trimmedCity || !/^[a-zA-Z\s]+$/.test(trimmedCity)) {
      setInputError("Please enter a valid city name");
      return;
    }

    // ✅ clear error
    setInputError("");

    dispatch(fetchWeather(trimmedCity));
    dispatch(fetchForecast(trimmedCity));
  };

  const handleQuickCity = (c) => {
    setCity(c);
    setInputError("");
    dispatch(fetchWeather(c));
    dispatch(fetchForecast(c));
  };

  const getIcon = (main) => {
    if (main === "Clear") return "☀️";
    if (main === "Clouds") return "☁️";
    if (main === "Rain") return "🌧️";
    if (main === "Smoke") return "🌫️";
    return "🌤️";
  };

  const showError = inputError || error;

  return (
    <div className="app">
      <h1>🌦️ Weather Dashboard</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setInputError("");
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* ✅ CLEAN ERROR (no box) */}
      {showError && <p className="error-text">{showError}</p>}

      {/* Quick Cities */}
      <div className="quick-cities">
        {["Ahmedabad", "Delhi", "Mumbai"].map((c) => (
          <button key={c} onClick={() => handleQuickCity(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <p className="loading">Loading...</p>}

      {/* Empty State */}
      {!data && !loading && !showError && (
        <div className="empty-state">
          <div className="empty-icon">🌍</div>
          <h2>Search for a City</h2>
          <p>Get real-time weather and 5-day forecast instantly</p>
        </div>
      )}

      {/* Main Card */}
      {!loading && data && (
        <div className="main-card">
          <p className="day">Today</p>
          <p className="condition">{data.weather[0].main}</p>

          <div className="icon">{getIcon(data.weather[0].main)}</div>

          <p className="temp">{Math.round(data.main.temp)}°C</p>

          <div className="extra-row">
            <span>💧 Humidity: {data.main.humidity}%</span>
            <span>🌬️ Wind: {data.wind.speed} m/s</span>
          </div>
        </div>
      )}

      {/* Forecast */}
      {!loading && forecast.length > 0 && (
        <div className="forecast">
          {forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="forecast-card">
              <p className="day">
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>

              <p className="condition">{day.weather[0].main}</p>

              <div className="icon">
                {getIcon(day.weather[0].main)}
              </div>

              <p className="temp">{Math.round(day.main.temp)}°C</p>

              <div className="extra">
                <p>💧 {day.main.humidity}%</p>
                <p>🌬️ {day.wind.speed} m/s</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;