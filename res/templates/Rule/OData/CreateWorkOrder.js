export default function CreateWorkOrder(pageProxy) {
  // Decide whether to use the action that expects an OrderId. We don't want to pass
  // an empty string as the OrderId to CreateWorkOrderWithId.action.
  const orderId = pageProxy.getControl('FormCellContainer').getControl('OrderId').getValue();
  if (orderId) {
    return pageProxy.executeAction('/MDKDevApp/Actions/OData/CreateRelatedEntity/CreateWorkOrderWithId.action');
  } else {
    return pageProxy.executeAction('/MDKDevApp/Actions/OData/CreateRelatedEntity/CreateWorkOrder.action');
  }
}