export default function CheckBarcodeScannerPrerequisiteResult(pageProxy) {
  var actionResult = pageProxy.getActionResult('CheckCamera');
  if (actionResult) {
    pageProxy.setActionBinding({
      'IsCameraReady': actionResult.data,
    });
    return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/BarcodeScanner/NavToBarcodeScannerPage.action');
  }
}
