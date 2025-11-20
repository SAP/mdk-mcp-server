export default function ToolbarOnloaded(pageProxy) {
  const mainPage = pageProxy.evaluateTargetPathForAPI('#Page:SeamDevApp');
  const mainPageData = mainPage.getClientData();
  mainPageData['ToolbarItemBindingCaption'] = "DTP";

  return pageProxy.read('/MDKDevApp/Services/Amw.service', "MyWorkOrderHeaders", [], "$orderby=OrderId&$top=1").then(function(result) {
    pageProxy.setActionBinding(result.getItem(0));
  });
}