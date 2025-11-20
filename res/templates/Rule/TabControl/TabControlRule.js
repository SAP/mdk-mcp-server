// export option #1 using default es6 syntax
export default function TabControlRule(clientAPI) {
  let currentTabItemCaption = clientAPI.getCaption();
  console.log('currentTabItemCaption: ' + currentTabItemCaption);
  clientAPI.setCaption('CaptionUpdated');
  currentTabItemCaption = clientAPI.getCaption();
  console.log('currentTabItemCaption: ' + currentTabItemCaption);

  // let tabmsg = currentTabItemCaption + " Tab Pressed";
  // clientAPI.getPageProxy().setActionBinding({'message':tabmsg});
  // return clientAPI.executeAction("/MDKDevApp/Actions/Messages/MessageWithOrderDetails.action");
}