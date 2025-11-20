export default function ActionBarMessage(pageProxy) {
  const pressedItem = pageProxy.getPressedItem();
  let txtMessage = "testing";
  if (pressedItem && pressedItem.getActionItem()) {
   txtMessage = pressedItem.getActionItem().text;
  }
  pageProxy.getClientData()['ActionBarMessageText'] = txtMessage;
  return pageProxy.executeAction('/MDKDevApp/Actions/ActionBarMessage.action').then(() => {
    return true;
  });
}
