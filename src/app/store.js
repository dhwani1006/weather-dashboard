import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "../app/features/weather/weatherSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});