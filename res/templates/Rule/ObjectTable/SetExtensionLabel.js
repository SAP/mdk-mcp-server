export default function SetExtensionLabel(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTableProxy = pageProxy.evaluateTargetPathForAPI("#Control:SectionedTable");
  const sectionProxy = sectionedTableProxy.getSection('ObjectHeaderSection');
  sectionProxy.getExtensions()[0].setLabel("The value is set through ClientAPI!");
}