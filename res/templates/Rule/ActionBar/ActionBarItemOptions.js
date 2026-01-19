export default function ActionBarItemOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let actionBarProxy = pageProxy.getActionBar();
    let sectionedTableProxy = pageProxy.getControl('ActionBarSectionedTable');
    if (sectionedTableProxy && actionBarProxy) {
      let controlProxy;
      let prevValue;
      let newValue;

      let leftyButton = 'Lefty';
      let saveButton = 'SaveButton';
      let doneButton = 'ActionButton';
      let iconButton = 'IconButton';
      let iconTextButton = 'IconTextButton';

      let oriCaption = 'Save';
      let oriSystemItem = 'Action';
      let oriIconText = 'AB';
      let oriIcon = 'sap-icon://home';
      let oriCaptionStyle = 'custom-actionbar-item-caption-style';

      let caption = 'Update';
      let systemItem = 'Camera';
      let iconText = 'CD';
      let icon = '/MDKDevApp/Images/profile2.png';
      let captionStyle = 'custom-actionbar-item-caption-style2';

      let itemProxy;
      
      let txtMessage = '';
      switch(controlName) {
        case 'SetItemCaptionSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemCaptionSwitch');
          itemProxy = actionBarProxy.getItem(saveButton);
          if (itemProxy) {
            prevValue = itemProxy.getCaption();
            if (controlProxy.getValue()) {
              newValue = caption;
            } else {
              newValue = oriCaption;
            }
            itemProxy.setCaption(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemIconTextSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemIconTextSwitch');
          itemProxy = actionBarProxy.getItem(iconTextButton);
          if (itemProxy) {
            prevValue = itemProxy.getIconText();
            if (controlProxy.getValue()) {
              newValue = iconText;
            } else {
              newValue = oriIconText;
            }
            itemProxy.setIconText(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemSystemItemSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemSystemItemSwitch');
          itemProxy = actionBarProxy.getItem(doneButton);
          if (itemProxy) {
            prevValue = itemProxy.getSystemItem();
            if (controlProxy.getValue()) {
              newValue = systemItem;
            } else {
              newValue = oriSystemItem;
            }
            itemProxy.setSystemItem(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemIconSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemIconSwitch');
          itemProxy = actionBarProxy.getItem(iconButton);
          if (itemProxy) {
            prevValue = itemProxy.getIcon();
            if (controlProxy.getValue()) {
              newValue = icon;
            } else {
              newValue = oriIcon;
            }
            itemProxy.setIcon(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemIsIconCircularSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemIsIconCircularSwitch');
          itemProxy = actionBarProxy.getItem(iconButton);
          if (itemProxy) {
            prevValue = itemProxy.getIsIconCircular();
            if (controlProxy.getValue()) {
              newValue = true;
            } else {
              newValue = false;
            }
            itemProxy.setIsIconCircular(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemVisibleSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemVisibleSwitch');
          itemProxy = actionBarProxy.getItem(iconButton);
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
        case 'SetItemEnabledSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemEnabledSwitch');
          itemProxy = actionBarProxy.getItem(doneButton);
          if (itemProxy) {
            prevValue = itemProxy.getEnabled();
            if (controlProxy.getValue()) {
              newValue = true;
            } else {
              newValue = false;
            }
            itemProxy.setEnabled(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        case 'SetItemStyleCaptionSwitch':
          controlProxy = sectionedTableProxy.getControl('SetItemStyleCaptionSwitch');
          itemProxy = actionBarProxy.getItem(leftyButton);
          if (itemProxy) {
            prevValue = itemProxy.getStyle();
            if (controlProxy.getValue()) {
              newValue = captionStyle;
            } else {
              newValue = oriCaptionStyle;
            }
            itemProxy.setStyle(newValue);
            txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          }
          break;
        default:
          break;
      }

      pageProxy.getClientData()['ActionBarOptionText'] = txtMessage;
      return pageProxy.executeAction('/MDKDevApp/Actions/Toast/ActionBarMessage.action');
    }
  }
}