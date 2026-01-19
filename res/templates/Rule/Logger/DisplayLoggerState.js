export default function DisplayLoggerState(controlProxy) {
  let logger = controlProxy.getLogger();
  if (controlProxy.getLogger().isTurnedOn()) {
    return 'Logger State: On';
  } else {
    return 'The logger did not log a message, because it is turned off';
  }
}