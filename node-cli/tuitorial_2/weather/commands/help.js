export default (args) => {
  const usage = {
    main: {
      usage: "weather [command]",
      commands: `
      commands:
        weather today <options>.............shows today's weather, use weather today help for more info
        weather forecast <options>..........shows forecasted weather, use weather forecast help for more info
        weather help........................shows this help message
        weather version.....................shows version
      `
    },
    today: {
      usage: "weather today <options>",
    },
    forecast: {
      usage: "weather forecast <options>",
    },
  };

  const subCmd = args._[0] === "help" ? "main" : args._[0];


  return console.info(usage[subCmd].usage, "\n", usage[subCmd].commands ?? "");
};


