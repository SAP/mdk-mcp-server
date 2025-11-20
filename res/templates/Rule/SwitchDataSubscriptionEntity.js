export default function SwitchDataSubscriptionEntity(pageProxy) {
  const workOrder = ["MyWorkOrderHeaders"];
  const categorySales = ["Category_Sales_for_1997"];
  const fioriToolbar = pageProxy.getFioriToolbar();
  let dataSubs = fioriToolbar.getDataSubscriptions();
  if (dataSubs.length === categorySales.length && dataSubs.every((value, index) => value === categorySales[index])) {
    fioriToolbar.setDataSubscriptions(workOrder)
    return pageProxy.executeAction('/MDKDevApp/Actions/DataSubscriptionChange.action');
  } else {
    fioriToolbar.setDataSubscriptions(categorySales)
    return pageProxy.executeAction('/MDKDevApp/Actions/DataSubscriptionChange2.action');
  }
}