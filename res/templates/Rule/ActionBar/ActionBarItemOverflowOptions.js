export default function ActionBarItemOverflowOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let actionBarProxy = pageProxy.getActionBar();
    let sectionedTableProxy = pageProxy.getControl('ActionBarSectionedTable');
    if (sectionedTableProxy && actionBarProxy) {
      let controlProxy;
      let itemProxy;
      let prevValue;
      let newValue;
      let oriSystemItem = 'Action';
      let oriIcon = 'sap-icon://home';
      let txtMessage = '';
      let itemName = '';
      switch(controlName) {
        case 'SetItem1IconSwitch':
        case 'SetItem2IconSwitch':
        case 'SetItem3IconSwitch':
        case 'SetItem4IconSwitch':
        case 'SetItem5IconSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          itemName = controlName.replace('Set', '').replace('IconSwitch', '');
          itemProxy = actionBarProxy.getItem(itemName);
          if (itemProxy) {
            prevValue = itemProxy.getSystemItem();
            if (controlProxy.getValue()) {
              newValue = oriSystemItem;
            } else {
              newValue = '';
            }
            itemProxy.setSystemItem(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItem1VisibleSwitch':
        case 'SetItem2VisibleSwitch':
        case 'SetItem3VisibleSwitch':
        case 'SetItem4VisibleSwitch':
        case 'SetItem5VisibleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          itemName = controlName.replace('Set', '').replace('VisibleSwitch', '');
          itemProxy = actionBarProxy.getItem(itemName);
          if (itemProxy) {
            prevValue = itemProxy.getVisible();
            if (controlProxy.getValue()) {
              newValue = true;
            } else {
              newValue = false;
            }
            itemProxy.setVisible(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemLogoVisibleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getLogo();
          if (controlProxy.getValue()) {
            newValue = oriIcon;
          } else {
            newValue = '';
          }
          actionBarProxy.setLogo(newValue);
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetItemSearchEnabledSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          let sectionProxy = sectionedTableProxy.getSection('ObjectTable');
          if (sectionProxy) {
            newValue = controlProxy.getValue();
            let prevPageClientData = context.evaluateTargetPath('#Page:ActionBarExamples/#ClientData');
            if (prevPageClientData) {
              prevPageClientData['SectionSearchEnabled'] = newValue
              sectionProxy.redraw();
              setTimeout(() => {
                actionBarProxy.redraw();
              }, 500);
            }
          }
          txtMessage = 'SearchEnabled New value: ' + newValue;
          break;
        default:
          break;
      }

      pageProxy.getClientData()['ActionBarOptionText'] = txtMessage;
      return pageProxy.executeAction('/MDKDevApp/Actions/Toast/ActionBarMessage.action');
    }
  }
}