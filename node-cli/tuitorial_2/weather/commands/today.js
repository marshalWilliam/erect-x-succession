import ora from "ora";
import { getWeather } from "../config/get-weather.js";
import { Logger } from "../config/logger.js";
import forecast from "./forecast.js";

const logger = Logger("today");
export default async (args) => {
  const spinner = ora().start();

  try {
    const location = args.location || args.l;

    const weather = await getWeather({
      location: {
        latitude: "14.6042",
        longitude: "120.9822",
      },
      forecast_days: 1,
    });
    
    spinner.stop();

    const date = new Date(weather.current.time);

    const weatherToday = `
    Date: ${date.toDateString()}
    Time: ${date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Shanghai" //to fix timezone
    })}
    Temperature: ${weather.current.temperature_2m}°C
    Weather: ${weather.current.weather_code}
    `

    logger.info("Today's Weather:\n ", weatherToday);
  } catch (error) {
    spinner.stop();

    logger.error("App encountered an error: ",error);
  }
};
