export default function ReceiveNotificationResponseEventHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    // payload might defferent data between iOS and Android
    // const payload = appEventData.payload;
    const userAction = appEventData.actionIdentifier;
    const badge = appEventData.badge;
    const title = appEventData.title;
    const body = appEventData.body;
    const data = appEventData.data;

    // clear badge number
    clientAPI.setApplicationIconBadgeNumber(0);

    // developers can define custom application logic here
    if (clientAPI.setActionBinding) {
        clientAPI.setActionBinding({
            'actionIdentifier': userAction,
            'badge': badge,
            'title': title,
            'body': body,
            'data': '\n' + JSON.stringify(data, null, 4)
        });
        return clientAPI.executeAction('/MDKDevApp/Actions/PushNotification/NavToNotificationDetails.action');    
    }
}