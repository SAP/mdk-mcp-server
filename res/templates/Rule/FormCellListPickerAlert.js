export default function FormCellListPickerAlert(listpickerProxy) {
    if (listpickerProxy.getValue().length > 0) {
        listpickerProxy.getPageProxy().getClientData().Message = listpickerProxy.getValue()[0].DisplayValue;
    } else {
        listpickerProxy.getPageProxy().getClientData().Message = "NO Selection!"
    }

    return listpickerProxy.executeAction('/MDKDevApp/Actions/Messages/AlertMessage.action');
}
