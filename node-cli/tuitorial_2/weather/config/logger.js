import chalk from "chalk";

export function Logger(args) {
  return {
    info: (...args) => console.log(chalk.green(...args)),
    warn: (...args) => console.log(chalk.yellow(...args)),
    error: (...args) => console.log(chalk.red(...args)),
    debug: (...args) => console.log(chalk.cyan(...args)),
  }
}
