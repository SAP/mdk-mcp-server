export default function ForegroundNotificationEventHandler(clientAPI) {
    var appEventData = clientAPI.getAppEventData();
    // payload might defferent data between iOS and Android
    // var payload = appEventData.payload;
    clientAPI.setActionBinding({
        title: appEventData.title,
        message: appEventData.body
    });
    return clientAPI.executeAction('/MDKDevApp/Actions/PushNotification/PresentNotification/AsAlert.action').then(()=>{
        /*
        the retuen value indicating how to present a notification in a foreground app.
        on iOS devices:
            None - do nothing 
            Alert - Display the alert using the content provided by the notification.
            Badge - Apply the notification's badge value to the app’s icon.
            Sound - Play the sound associated with the notification.
            All - equals Alert | Badge | Sound
        the retuen value has no effect on Android devices.
        */
        return appEventData.PresentationOptions.All;
    });
}