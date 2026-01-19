let iconIndex = 0;

export default function ToolbarOptions(context) {
  let controlName = context.getName();
  let pageProxy = context.getPageProxy();
  if (pageProxy) {
    let fioriToolbar = pageProxy.getFioriToolbar();
    let sectionedTableProxy = pageProxy.getControl('FioriToolbarSection');
    if (sectionedTableProxy && fioriToolbar) {
      let controlProxy;
      let prevValue;
      let newValue;
      let helperText = 'helper text';
      let sapIcons = ['sap-icon://collision', 'https://raw.githubusercontent.com/SVGKit/SVGKit/master/Demo-Samples/SVG/Note.svg', 'res://test_rectangle', '/MDKDevApp/Images/ShareButton.svg', "$(PLT, 'res://test.walk.arrival', 'res://test_rectangle')"];
      switch(controlName) {
        case 'HelperTextSwitch':
          controlProxy = sectionedTableProxy.getControl('HelperTextSwitch');
          prevValue = fioriToolbar.getHelperText();
          if (controlProxy.getValue()) {
            newValue = helperText;
          } else {
            newValue = '';
          }
          fioriToolbar.setHelperText(newValue);
          alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          break;
        case 'OverflowIconSwitch':
          controlProxy = sectionedTableProxy.getControl('OverflowIconSwitch');
          if (controlProxy.getValue()) {
            newValue = sapIcons[iconIndex];
            if (iconIndex < sapIcons.length - 1) {
              iconIndex++;
            } else {
              iconIndex = 0;
            }
          } else {
            newValue = '';
          }
          fioriToolbar.setOverflowIcon(newValue);
          alert('New value: ' + newValue);
          break;
          break;
        case 'VisibleSwitch':
          controlProxy = sectionedTableProxy.getControl('VisibleSwitch');
          prevValue = fioriToolbar.getVisible();
          newValue = controlProxy.getValue();
          fioriToolbar.setVisible(newValue);
          let toolbarOptionSection = sectionedTableProxy.getSection('ToolbarOptionSection');
          let shareSection = sectionedTableProxy.getSection('ToolbarShareButtonOptionSection');
          let discardSection = sectionedTableProxy.getSection('ToolbarDiscardButtonOptionSection');
          let submitSection = sectionedTableProxy.getSection('ToolbarSubmitButtonOptionSection');
          if (toolbarOptionSection) {
            toolbarOptionSection.setVisible(newValue);
          }
          if (shareSection) {
            shareSection.setVisible(newValue);
          }
          if (discardSection) {
            discardSection.setVisible(newValue);
          }
          if (submitSection) {
            submitSection.setVisible(newValue);
          }
          alert('Prev value: ' + prevValue + '\nNew value: ' + newValue);
          break;
        default:
          break;
      }
    }
  }
}