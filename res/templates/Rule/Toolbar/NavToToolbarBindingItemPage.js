export default function NavToToolbarBindingItemPage(sectionedTableProxy) {
  const mainPage = sectionedTableProxy.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  mainPageData['ToolbarItemBindingCaption'] = "DTP";

  return sectionedTableProxy.read('/MDKDevApp/Services/Amw.service', "MyWorkOrderHeaders", [], "$orderby=OrderId&$top=1").then(function(result) {
    sectionedTableProxy.getPageProxy().setActionBinding(result.getItem(0));
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToToolbarItemBindingPage.action');
  }).catch((error) => {
    return sectionedTableProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToToolbarItemBindingPage.action');
  });
}