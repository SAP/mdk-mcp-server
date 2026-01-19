export default function TimestampState(context) {
  let appContext = context.evaluateTargetPath("#Application");
  let timestampState = appContext.context.clientData.timestampState;
  
  if (!timestampState) {
    timestampState = 'Start';
  } else if (timestampState === 'Start') {
    timestampState = 'Open';
  }

  appContext.context.clientData.timestampState = timestampState;

  return timestampState;
}
