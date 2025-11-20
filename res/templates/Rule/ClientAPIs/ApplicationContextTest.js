export default function ApplicationContextTest(context) {
  let appContext = context.evaluateTargetPath("#Application");
  let contextStr = JSON.stringify(appContext.context.clientData);
  if (contextStr != undefined || contextStr.length > 0) {
    alert('Application Context Success');
  } else {
    alert('Application Context Failed');
  }
}
