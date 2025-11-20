export default function GetDataSubscriptionEntity(pageProxy) {
    const fioriToolbar = pageProxy.getFioriToolbar();
    let dataSubs = fioriToolbar.getDataSubscriptions();
    pageProxy.getClientData().Message = dataSubs
    return pageProxy.executeAction('/MDKDevApp/Actions/Messages/ShowDSEntityMessage.action');
  }