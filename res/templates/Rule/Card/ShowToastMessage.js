export default function ShowToastMessage(context) {
  var text = '';
  if (context.getName()) {
    text += 'OnPress triggered from: ' + context.getName() + '\n';
  } else {
    text += 'OnPress triggered from index: ' + context.getIndex() + '\n';
  }
  if (context && context.constructor && context.constructor.name) {
    text += 'Proxy class received: ' + (context && context.constructor ? context.constructor.name : '\n');
  }
 
  let examplePageProxy = context.evaluateTargetPathForAPI('#Page:CardExamplesPage');
  if (examplePageProxy) {
    let pageClientData = examplePageProxy.getClientData();
    pageClientData.ToastMessageText = text;
  }
  return context.executeAction('/MDKDevApp/Actions/Toast/CardToastMessage.action');
}
