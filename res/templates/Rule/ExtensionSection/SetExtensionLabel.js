export default function SetExtensionLabel(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTableProxy = pageProxy.evaluateTargetPathForAPI("#Control:SectionedTable");
  const sectionProxy = sectionedTableProxy.getSection('ExtensionSection');
  sectionProxy.getExtension().setLabel("The value is set through ClientAPI!");
}