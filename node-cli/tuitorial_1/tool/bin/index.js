#!/usr/bin/env node

import arg from "arg";
import chalk from "chalk";
import { start } from "../src/commands/start.js";
import { getConfig } from "../src/config/config-mgr.js";
import { Logger } from "../src/logger.js";

const logger = Logger('index');

try {
  const args = arg({
    "--start": Boolean,
    "-s": Boolean,
    "--build": Boolean,
    "-b": Boolean,
    "--help": Boolean,
    "-h": Boolean,
    "--type": String,
    "-t": String,
  });

  if (args["--start"] || args["-s"]) {
    logger.info("Loading Project Configuration...");

    let type = "";
    if (args["--type"] || args["-t"]) {
      type = args["--type"] || args["-t"];
    } else {
      type = "config";
    }

    const config = await getConfig(type);

    logger.info("Configuration Loaded.");
    console.log("-".padEnd(process.stdout.columns, "-"));

    start(config);
  } else if (args["--build"] || args["-b"]) {
    logger.info("building the app");
  } else if (args["--help"] || args["-h"]) {
    usage();
  }
} catch (error) {
  logger.error("App encountered an error:", error.message);
  usage();
}

function usage() {
  console.log(chalk.whiteBright("\nUsage:"));
  console.log(chalk.greenBright("  tool --start | -s\tstarts the app"));
  console.log(chalk.greenBright("  tool --build | -b\tbuilds the app"));
  console.log(
    chalk.greenBright(
      "  tool --type  | -t\tselect the type of configuration to load, default is 'config'. Values: (config | pkg)"
    )
  );
}
