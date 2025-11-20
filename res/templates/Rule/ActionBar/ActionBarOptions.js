export default function ActionBarOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let actionBarProxy = pageProxy.getActionBar();
    let sectionedTableProxy = pageProxy.getControl('ActionBarSectionedTable');
    if (sectionedTableProxy && actionBarProxy) {
      let controlProxy;
      let prevValue;
      let newValue;

      let oriCaption = 'This is caption';
      let oriSubhead = 'This is subhead';
      let oriPrefersLargeCaption = false;
      let oriCaptionAlignment = 'Left';
      let oriOverflowIcon = '';
      let oriCaptionStyle = 'custom-actionbar-caption-style';
      let oriSubheadStyle = 'custom-actionbar-subhead-style';
      let oriActionBarStyle = 'custom-actionbar-style';
      let oriIconStyle = 'font-icon-class';
      

      let caption = 'new caption';
      let subhead = 'new subhead';
      let prefersLargeCaption = true;
      let captionAlignment = 'Center';
      let overflowIcon = 'sap-icon://collision';
      let captionStyle = 'custom-actionbar-caption-style2';
      let subheadStyle = 'custom-actionbar-subhead-style2';
      let actionBarStyle = 'custom-actionbar-style2';
      let iconStyle = 'font-icon-class-blue';

      let txtMessage = '';
      switch(controlName) {
        case 'SetCaptionSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getCaption();
          if (controlProxy.getValue()) {
            newValue = caption;
          } else {
            newValue = oriCaption;
          }
          actionBarProxy.setCaption(newValue);
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetSubheadSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getSubhead();
          if (controlProxy.getValue()) {
            newValue = subhead;
          } else {
            newValue = oriSubhead;
          }
          actionBarProxy.setSubhead(newValue);
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetCaptionAlignmentSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getCaptionAlignment();
          if (controlProxy.getValue()) {
            newValue = captionAlignment;
          } else {
            newValue = oriCaptionAlignment;
          }
          actionBarProxy.setCaptionAlignment(newValue);
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetPrefersLargeCaptionSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getPrefersLargeCaption();
          if (controlProxy.getValue()) {
            newValue = prefersLargeCaption;
          } else {
            newValue = oriPrefersLargeCaption;
          }
          actionBarProxy.setPrefersLargeCaption(newValue);
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetOverflowIconSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getOverflowIcon();
          if (controlProxy.getValue()) {
            newValue = overflowIcon;
          } else {
            newValue = oriOverflowIcon;
          }
          actionBarProxy.setOverflowIcon(newValue);
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetActionBarStyleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getStyle() ? actionBarProxy.getStyle()['ActionBar'] : '';
          if (controlProxy.getValue()) {
            newValue = actionBarStyle;
          } else {
            newValue = oriActionBarStyle;
          }
          actionBarProxy.setStyle(newValue, 'ActionBar');
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetCaptionStyleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getStyle() ? actionBarProxy.getStyle()['Caption'] : '';
          if (controlProxy.getValue()) {
            newValue = captionStyle;
          } else {
            newValue = oriCaptionStyle;
          }
          actionBarProxy.setStyle(newValue, 'Caption');
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetSubheadStyleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getStyle() ? actionBarProxy.getStyle()['Subhead'] : '';
          if (controlProxy.getValue()) {
            newValue = subheadStyle;
          } else {
            newValue = oriSubheadStyle;
          }
          actionBarProxy.setStyle(newValue, 'Subhead');
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetLogoStyleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getStyle() ? actionBarProxy.getStyle()['Logo'] : '';
          if (controlProxy.getValue()) {
            newValue = iconStyle;
          } else {
            newValue = oriIconStyle;
          }
          actionBarProxy.setStyle(newValue, 'Logo');
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        case 'SetOverflowIconStyleSwitch':
          controlProxy = sectionedTableProxy.getControl(controlName);
          prevValue = actionBarProxy.getStyle() ? actionBarProxy.getStyle()['OverflowIcon'] : '';
          if (controlProxy.getValue()) {
            newValue = iconStyle;
          } else {
            newValue = oriIconStyle;
          }
          actionBarProxy.setStyle(newValue, 'OverflowIcon');
          txtMessage = 'Prev value: ' + prevValue + '\nNew value: ' + newValue;
          break;
        default:
          break;
      }

      pageProxy.getClientData()['ActionBarOptionText'] = txtMessage;
      return pageProxy.executeAction('/MDKDevApp/Actions/Toast/ActionBarMessage.action');
    }
  }
}