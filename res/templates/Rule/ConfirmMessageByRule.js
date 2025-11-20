export default function ConfirmMessageByRule(clientAPI) {
    return clientAPI.executeAction('/MDKDevApp/Actions/Messages/ConfirmMessageByRule.action').then((result)=>{
        if (result.data) {
            clientAPI.executeAction('/MDKDevApp/Actions/Toast/ConfirmationOK.action');
        } else {
            clientAPI.executeAction('/MDKDevApp/Actions/Toast/ConfirmationCancel.action');
        }
    });
}