export default function DisableSync(context) {
  let pageProxy = context.getPageProxy();
  pageProxy.getClientData()['ActionBarOptionText'] = 'Sync completed';
  return pageProxy.executeAction('/MDKDevApp/Actions/Toast/ActionBarMessage.action').then(() => {
    context.setEnabled(false);
  });
}
