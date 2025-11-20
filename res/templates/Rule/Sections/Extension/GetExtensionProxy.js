export default function GetExtensionProxy(clientAPI) {
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTableProxy = pageProxy.evaluateTargetPathForAPI("#Control:SectionedTable");
  const sectionProxy = sectionedTableProxy.getSection('ObjectCollection');
  alert("This is " + sectionProxy.constructor.name);
}