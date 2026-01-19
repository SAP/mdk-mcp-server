let updateClientData = true;
export default function UpdateBinding(context) {
  let appContext = context.evaluateTargetPath("#Application").context;
  let appClientData = context.getAppClientData();
  if (updateClientData) {
    appClientData.UserId = "New User";
    appClientData.DeviceId = "New Device";
    appClientData.MobileServiceAppId = "New AppId";
    updateClientData = false;
  } else {
    appClientData.UserId = appContext.appData.UserId;
    appClientData.DeviceId = appContext.appData.DeviceId;
    appClientData.MobileServiceAppId = appContext.appData.MobileServiceAppId;
    updateClientData = true;
  }

  const container = context.getControl('FormCellContainer');
  container.reset(); 
  
}
