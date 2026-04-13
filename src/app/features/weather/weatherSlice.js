import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeatherAPI, fetchForecastAPI } from "./weatherAPI";

// CURRENT WEATHER
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city, thunkAPI) => {
    try {
      const data = await fetchWeatherAPI(city);

      // extra safety check
      if (!data || data.cod !== 200) {
        return thunkAPI.rejectWithValue("City not found");
      }

      return data;
    } catch {
      return thunkAPI.rejectWithValue("City not found");
    }
  }
);

// FORECAST
export const fetchForecast = createAsyncThunk(
  "weather/fetchForecast",
  async (city, thunkAPI) => {
    try {
      const data = await fetchForecastAPI(city);

      if (!data || data.cod !== "200") {
        return thunkAPI.rejectWithValue("Forecast error");
      }

      return data;
    } catch {
      return thunkAPI.rejectWithValue("Forecast error");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    data: null,
    forecast: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ✅ WEATHER
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;

        // clear old data
        state.data = null;
        state.forecast = [];
      })

      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ FORECAST
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;

        // pick one forecast per day (12:00)
        const daily = action.payload.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

        state.forecast = daily;
      })

      .addCase(fetchForecast.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default weatherSlice.reducer;