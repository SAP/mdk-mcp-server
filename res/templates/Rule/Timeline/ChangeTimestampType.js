export default function ChangeTimestampType(context) {
  let appContext = context.evaluateTargetPath("#Application");
  let timestampType = appContext.context.clientData.timestampType;
  
  if (!timestampType) {
    timestampType = 'MonthDayTime';
  }

  if (timestampType === 'MonthDayTime') {
    timestampType = 'MonthDay';
  } else if (timestampType === 'MonthDay') {
    timestampType = 'Day';
  } else if (timestampType === 'Day') {
    timestampType = 'Time';
  } else if (timestampType === 'Time') {
    timestampType = 'DayTime';
  } else if (timestampType === 'DayTime') {
    timestampType = 'MonthDayTime';
  }

  appContext.context.clientData.timestampType = timestampType;

  let pageProxy = context.getPageProxy();
  pageProxy.redraw();
}
