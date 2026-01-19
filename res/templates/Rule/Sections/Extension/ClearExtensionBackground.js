export default function ClearExtensionBackground(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTableProxy = pageProxy.evaluateTargetPathForAPI("#Control:SectionedTable");
  const sectionProxy = sectionedTableProxy.getSection('ObjectCollection');
  
  const segmentedControlProxy = pageProxy.evaluateTargetPathForAPI("#Control:SegmentedControl");

  const selectedIndex = segmentedControlProxy.getValue()[0].SelectedIndex;
  switch (selectedIndex) {
    case 3:
      sectionProxy.getExtensions().forEach(extension => {
        extension.clearBackgroundColor();
      });
      break;
    default:
      sectionProxy.getExtensions()[selectedIndex].clearBackgroundColor();
      break;
  }
}