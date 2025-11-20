export default function TabControlSwitchTabExampleRule(clientAPI) {
  let tabControl;
  try {
    tabControl = clientAPI.evaluateTargetPathForAPI("#Page:BottomNavigationPage/#Control:BottomNavigationControl");
  } catch(e) {
    console.log('error on finding tab control: BottomNavigationControl');
  }
  if (!tabControl) {
    try {
      tabControl = clientAPI.evaluateTargetPathForAPI("#Page:TabsPage/#Control:TabsControl");
    } catch(e) {
      console.log('error on finding tab control: TabsControl');
    }
  }
  if (tabControl) {
    let currentSelectedTabItemName = tabControl.getSelectedTabItemName();
    let currentSelectedTabItemIndex = tabControl.getSelectedTabItemIndex();
    console.log('currentSelectedTabItemName: ' + currentSelectedTabItemName);
    console.log('currentSelectedTabItemIndex: ' + currentSelectedTabItemIndex);
    tabControl.setSelectedTabItemByName('ControlsTab');  
    currentSelectedTabItemName = tabControl.getSelectedTabItemName();
    currentSelectedTabItemIndex = tabControl.getSelectedTabItemIndex();
    console.log('currentSelectedTabItemName: ' + currentSelectedTabItemName);
    console.log('currentSelectedTabItemIndex: ' + currentSelectedTabItemIndex);
  }
}