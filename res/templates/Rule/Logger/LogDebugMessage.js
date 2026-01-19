export default function LogDebugMessage(sectionedTableProxy) {
  let logger = sectionedTableProxy.getLogger();
  logger.setLevel("Debug").then(() => {
    let logLevel = logger.getLevel();
    let message = `Logged a test message with '${logLevel}' log level.`;
    if (logger.isTurnedOn()) {
      logger.log(message, logLevel);
      sectionedTableProxy.getPageProxy().getClientData()['LoggedMessage'] = message;
      return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogMessageSuccessToast.action');
    } else {
      return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Logger/LogMessageFailToast.action');
    }
  });
}
