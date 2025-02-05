import chalk from "chalk";
import debug from "debug";

export const Logger = (message) => {
  return {
    info: (...args) => console.log(chalk.green(...args)),
    warn: (...args) => console.log(chalk.yellow(...args)),
    error: (...args) => console.log(chalk.red(...args)),
    debug: debug(message),
  };
};
