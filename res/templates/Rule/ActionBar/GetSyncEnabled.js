export default function GetSyncEnabled(context) {
  const pageProxy = context.getPageProxy();
  let cd = pageProxy.getClientData();
  if (cd.SyncEnabled !== undefined) {
   return cd.SyncEnabled;
  } else {
    return false;
  }
}
