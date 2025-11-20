export default function AlertOnSuccess(clientAPI) {
    var actionResult = clientAPI.getActionResult('ConfrimMessageByRule');
    if (actionResult) {
        if (actionResult.data) {
            clientAPI.getClientData().Message = "Received OK from OnSuccess";
        } else {
            clientAPI.getClientData().Message = "Received Cancel from OnSuccess";
        }
        return clientAPI.executeAction('/MDKDevApp/Actions/Messages/AlertMessage.action');
    }
}
