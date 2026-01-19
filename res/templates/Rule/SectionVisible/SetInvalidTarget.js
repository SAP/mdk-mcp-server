export default function SetInvalidTarget(context) {
  var mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  var mainPageData = mainPage.getClientData();
  if (mainPageData) {
    mainPageData['GroupQO'] = '$expand=Stops,WorkOrder/OrderMobileStatus_Nav,WorkOrder/WOPriority';
  }
}