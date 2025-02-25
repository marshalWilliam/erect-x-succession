import axios from "axios";

export async function getWeather(args) {

  const params = {
    latitude: args.location.latitude,
    longitude: args.location.longitude,
    current: "temperature_2m,weather_code",
    hourly: "temperature_2m",
    forecast_days: args.forecast_days || 1,
  };

  const query = Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&");
  const results = await axios({
    method: "GET",
    url: `https://api.open-meteo.com/v1/forecast?${query}`,
    responseType: "json"
  });

  return results.data;

  
}
