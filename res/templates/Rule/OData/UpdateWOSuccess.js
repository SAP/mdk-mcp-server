export default function UpdateWOSuccess(context) {
  let pageProxy = context.getPageProxy();
  let mainPageProxy = pageProxy.evaluateTargetPathForAPI('#Page:SeamDevApp');
  if (mainPageProxy) {
    let pageData = mainPageProxy.getClientData();
    pageData['SyncEnabled'] = true;
  }
  return pageProxy.executeAction('/MDKDevApp/Actions/Toast/ToastAndClose.action');
}