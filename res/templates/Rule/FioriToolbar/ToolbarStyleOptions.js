export default function ToolbarStyleOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let fioriToolbar = pageProxy.getFioriToolbar();
    let sectionedTableProxy = pageProxy.getControl('FioriToolbarSection');
    if (sectionedTableProxy && fioriToolbar) {
      let controlProxy;
      let newValue;
      let toolbarStyle = 'fiori-toolbar-2';
      let helperTextStyle = 'fiori-toolbar-helpertext-2';
      let sapIconStyle = 'font-icon-class-blue';
      switch(controlName) {
        case 'HelperTextStyleSwitch':
          controlProxy = sectionedTableProxy.getControl('HelperTextStyleSwitch');
          if (controlProxy.getValue()) {
            fioriToolbar.setStyle(helperTextStyle, 'HelperText');
            alert('New value: ' + helperTextStyle);
          }
          break;
        case 'OverflowIconStyleSwitch':
          controlProxy = sectionedTableProxy.getControl('OverflowIconStyleSwitch');
          if (controlProxy.getValue()) {
            fioriToolbar.setStyle(sapIconStyle, 'OverflowIcon');
            alert('New value: ' + sapIconStyle);
          }
          break;
        case 'ToolbarStyleSwitch':
          controlProxy = sectionedTableProxy.getControl('ToolbarStyleSwitch');
          if (controlProxy.getValue()) {
            fioriToolbar.setStyle(toolbarStyle, 'FioriToolbar');
            alert('New value: ' + toolbarStyle);
          }
          break;
        default:
          break;
      }
    }
  }
}