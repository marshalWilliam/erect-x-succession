To use cli:

    sh: tool -s -t pkg

To enable debug:

    sh: DEBUG=* tool -s -t pkg

To enable debug with selected logs. (ex start with command and index logs):

    sh: DEBUG=command:*,index tool -s -t pkg

To enable debug with all logs except. (ex start with all logs except index):

    sh: DEBUG=*,-index tool -s -t pkg