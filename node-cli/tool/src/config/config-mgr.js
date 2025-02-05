import { packageUpSync } from "package-up";
import { cosmiconfigSync } from "cosmiconfig";
import Ajv from "ajv";
import betterAjvErrors from "better-ajv-errors";
import { Logger } from "../logger.js";

export const ConfigType = Object.freeze({
  PKG: "pkg",
  CONFIG: "config",
});

const logger = Logger("command:config");

export const getConfig = async (type) => {
  if (Object.values(ConfigType).includes(type) === false) {
    throw new Error("Invalid config type");
  }

  let pkg = {};

  if (type === ConfigType.PKG) {
    const pkgPath = packageUpSync({ cwd: process.cwd() });
    const result = await import(pkgPath, { with: { type: "json" } });

    pkg = result.default.tools ?? {};
  } else {
    const config = cosmiconfigSync("tool");
    const result = config.search(process.cwd());

    pkg = result ? result.config.default : {};
  }

  if (Object.keys(pkg).length > 0) {
    logger.debug(
      "Project configuration found:\n",
      JSON.stringify(pkg, null, 2)
    );

    logger.info("Validating project configuration...");

    const ajv = new Ajv();
    const { default: schema } = await import("./schema.json", {
      with: { type: "json" },
    });

    const isValidConfig = ajv.validate(schema, pkg);

    if (!isValidConfig) {
      logger.warn(
        "Project configuration is not valid:",
        betterAjvErrors(schema, pkg, ajv.errors)
      );

      process.exit(1);
    }

    logger.info("Project configuration valid, using configuration.");

    return pkg;
  } else {
    logger.warn("Project configuration not found, using defaults");

    return {
      name: "tool",
      sample: "sample",
      config: "default",
    };
  }
};
