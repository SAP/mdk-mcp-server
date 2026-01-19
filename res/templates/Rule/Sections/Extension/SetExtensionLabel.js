export default function SetExtensionLabel(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTableProxy = pageProxy.evaluateTargetPathForAPI("#Control:SectionedTable");
  const sectionProxy = sectionedTableProxy.getSection('ObjectCollection');
  
  const segmentedControlProxy = pageProxy.evaluateTargetPathForAPI("#Control:SegmentedControl");

  const selectedIndex = segmentedControlProxy.getValue()[0].SelectedIndex;
  switch (selectedIndex) {
    case 3:
      sectionProxy.getExtensions().forEach(extension => {
        extension.setLabel('The value is set through ClientAPI!');
      });
      break;
    default:
      sectionProxy.getExtensions()[selectedIndex].setLabel('The value is set through ClientAPI!');
      break;
  }
}