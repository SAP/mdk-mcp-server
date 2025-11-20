export default function ToolbarItemOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let fioriToolbar = pageProxy.getFioriToolbar();
    let sectionedTableProxy = pageProxy.getControl('FioriToolbarSection');
    if (sectionedTableProxy && fioriToolbar) {
      let controlProxy;
      let itemProxy;
      let prevValue;
      let newValue;
      let sfButton = 'sfButton';
      let shareButton = 'shareButton';
      let discardButton = 'discardButton';
      let submitButton = 'submitButton';
      let sapIcon = 'sap-icon://share';
      switch(controlName) {
        case 'ButtonImageSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonImageSwitch');
          if (controlProxy.getValue()) {
            newValue = sapIcon;
          } else {
            newValue = '';
          }
          itemProxy = fioriToolbar.getItem(shareButton);
          if (itemProxy) {
            itemProxy.setImage(newValue);
            alert('New value: ' + newValue);
          }
          break;
        case 'ButtonImagePositionSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonImagePositionSwitch');
          if (controlProxy.getValue()) {
            newValue = 'Leading';
          } else {
            newValue = 'Trailing';
          }
          itemProxy = fioriToolbar.getItem(shareButton);
          if (itemProxy) {
            prevValue = itemProxy.getImagePosition();
            itemProxy.setImagePosition(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          break;
        case 'ButtonVisibleSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonVisibleSwitch');
          if (controlProxy.getValue()) {
            newValue = true;
          } else {
            newValue = false;
          }
          itemProxy = fioriToolbar.getItem(submitButton);
          if (itemProxy) {
            prevValue = itemProxy.getVisible();
            itemProxy.setVisible(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          break;
        case 'ButtonEnabledSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonEnabledSwitch');
          if (controlProxy.getValue()) {
            newValue = true;
          } else {
            newValue = false;
          }
          itemProxy = fioriToolbar.getItem(submitButton);
          if (itemProxy) {
            prevValue = itemProxy.getEnabled();
            itemProxy.setEnabled(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          break;
        case 'ButtonTitleSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonTitleSwitch');
          if (controlProxy.getValue()) {
            newValue = 'Submit';
          } else {
            newValue = 'Save';
          }
          itemProxy = fioriToolbar.getItem(submitButton);
          if (itemProxy) {
            prevValue = itemProxy.getTitle();
            itemProxy.setTitle(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          break;
        case 'ButtonTypeSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonTypeSwitch');
          if (controlProxy.getValue()) {
            newValue = 'Primary';
          } else {
            newValue = 'Secondary';
          }
          itemProxy = fioriToolbar.getItem(submitButton);
          if (itemProxy) {
            prevValue = itemProxy.getButtonType();
            itemProxy.setButtonType(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          break;
        case 'ButtonSemanticSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonSemanticSwitch');
          if (controlProxy.getValue()) {
            newValue = 'Tint';
          } else {
            newValue = 'Negative';
          }
          itemProxy = fioriToolbar.getItem(shareButton);
          if (itemProxy) {
            prevValue = itemProxy.getSemantic();
            itemProxy.setSemantic(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          itemProxy = fioriToolbar.getItem(sfButton);
          if (itemProxy) {
            prevValue = itemProxy.getSemantic();
            itemProxy.setSemantic(newValue);
            alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          }
          break;
        default:
          break;
      }
    }
  }
}