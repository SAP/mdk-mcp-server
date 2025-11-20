export default function TimestampType(context) {
  let appContext = context.evaluateTargetPath("#Application");
  let timestampType = appContext.context.clientData.timestampType;
  
  if (!timestampType) {
    timestampType = 'MonthDayTime';
    appContext.context.clientData.timestampType = timestampType;
  }

  return timestampType;
}
