export default function GetExtensionsAPI(clientAPI) { 
  const pageProxy = clientAPI.getPageProxy();
  const sectionedTableProxy = pageProxy.evaluateTargetPathForAPI("#Control:SectionedTable");
  const sectionProxy = sectionedTableProxy.getSection('ExtensionSection');
  clientAPI.setDebugSettings(false, true, ['mdk.trace.api']);   
  let results = sectionProxy.getExtensions();
  // This will clear all the current debug settings as we don't have a way to getDebugSettings through ClientAPI
  clientAPI.setDebugSettings(false, true, ['']);
  alert("Calling getExtensions() on ExtensionSectionProxy returned: \n" + (results.length == 0 ? "[]" : results));
}