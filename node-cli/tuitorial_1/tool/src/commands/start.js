import { Logger } from "../logger.js";

const logger = Logger("command:start");

export const start = (config) => {
  logger.info("Starting the App... ");
  logger.debug("Received configuration\n", JSON.stringify(config, null, 2));
  logger.info("App Started! ");
};
