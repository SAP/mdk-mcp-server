export default function ShowDateTime(controlClientAPI) {
    const date = controlClientAPI.getValue();
    const pageProxy = controlClientAPI.getPageProxy();
    const container = pageProxy.getControl('DateTimeDisplayFormCellContainer');
    const pageData = pageProxy.getClientData();

    pageData.LoggedMessage = date.toISOString();    
    return controlClientAPI.executeAction('/MDKDevApp/Actions/Logger/LogMessageSuccessToast.action');
}