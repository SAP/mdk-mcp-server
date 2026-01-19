export default function ShowBarcodeScanningResult(pageProxy) {
  var actionResult = pageProxy.getActionResult('BarcodeScanner');
  if (actionResult) {
    pageProxy.setActionBinding({
      'Result': actionResult.data,
    });
    return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/BarcodeScanner/NavToBarcodeScannerSuccessPage.action');
  }
}
