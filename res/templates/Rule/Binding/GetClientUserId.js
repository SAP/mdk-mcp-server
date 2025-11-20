export default function GetClientUserId(context) {
  let appClientData = context.getAppClientData();
  return appClientData.UserId;
  
}
