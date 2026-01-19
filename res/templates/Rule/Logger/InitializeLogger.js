export default function InitializeLogger(clientAPI) {
  // initialize logger by rule
  clientAPI.initializeLogger('ClientLog.txt', 8);
  let logger = clientAPI.getLogger();
  logger.on();
  logger.setLevel('Info');
  // or you can even initialize the Logger by action
  //return clientAPI.executeAction('/MDKDevApp/Actions/Logger/InitializeLogger.action');
}

