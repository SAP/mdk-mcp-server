export default function GetClientDeviceId(context) {
  let appClientData = context.getAppClientData();
  return appClientData.DeviceId;
  
}
