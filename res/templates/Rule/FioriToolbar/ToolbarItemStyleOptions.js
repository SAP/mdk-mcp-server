export default function ToolbarItemStyleOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let fioriToolbar = pageProxy.getFioriToolbar();
    let sectionedTableProxy = pageProxy.getControl('FioriToolbarSection');
    if (sectionedTableProxy && fioriToolbar) {
      let controlProxy;
      let itemProxy;
      let submitButton = 'submitButton';
      let sapIconStyle = 'font-icon-class-blue';
      let buttonStyle = 'Styles2Button';
      switch(controlName) {
        case 'ButtonImageStyleSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonImageStyleSwitch');
          if (controlProxy.getValue()) {
            itemProxy = fioriToolbar.getItem(submitButton);
            if (itemProxy) {
              itemProxy.setStyle(sapIconStyle, 'Image');
              alert('New value: ' + sapIconStyle);
            }
          }
          break;
        case 'ButtonStyleSwitch':
          controlProxy = sectionedTableProxy.getControl('ButtonStyleSwitch');
          if (controlProxy.getValue()) {
            itemProxy = fioriToolbar.getItem(submitButton);
            if (itemProxy) {
              itemProxy.setStyle(buttonStyle, 'Button');
              alert('New value: ' + buttonStyle);
            }
          }
          break;
        default:
          break;
      }
    }
  }
}