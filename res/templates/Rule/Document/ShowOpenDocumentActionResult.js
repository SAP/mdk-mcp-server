export default function ShowOpenDocumentActionResult(pageProxy) {
  var actionResult = pageProxy.getActionResult('OpenDocument');
  if (actionResult) {
    pageProxy.setActionBinding({
      'Result': actionResult.data || actionResult.error,
    });
    return pageProxy.executeAction('/MDKDevApp/Actions/Document/OpenDocumentFailedWithErrorMessage.action');
  }
}
