import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

// Current weather
export const fetchWeatherAPI = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  return res.data;
};

// ✅ Forecast (NEW)
export const fetchForecastAPI = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  return res.data;
};