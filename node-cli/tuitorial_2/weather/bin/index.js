#!/usr/bin/env node

import minimist from "minimist";
import today from "../commands/today.js";
import usage from "../commands/help.js";
import { Logger } from "../config/logger.js";
import forecast from "../commands/forecast.js";

const logger = Logger("index");

/**
 * The reason we remove the first two arguments with .slice(2)
 * is because the first arg will always be the interpreter
 * followed by the name of the file being interpreted.
 */
const args = minimist(process.argv.slice(2));

let cmd = args._[0];

if (args.version || args.v) cmd = "version";
if (args.help || args.h) {
  args._[0] = "help";
  cmd = "help";
}
if (args._.includes("help")) cmd = "help";

logger.info(args, JSON.stringify(args, null, 2));

switch (cmd) {
  case "today":
    today(args);
    break;
  case "forecast":
    forecast(args);
    break;
  case "version":
    const { default: pkg } = await import("../package.json", {
      with: { type: "json" },
    });
    logger.info(`v${pkg.version}`);
    break;
  case "help":
    usage(args);
    break;
  default:
    logger.error("Invalid or missing command, use weather help for more info");
    break;
}
