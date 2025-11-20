export default function ContentAvailableEventHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    // payload might defferent data between iOS and Android
    const payload = appEventData.payload; 

    // Developers can define custom application logic here. fetch new data etc..
    clientAPI.setActionBinding({
        title: "OnReceiveFetchCompletion",
        message: "\n" + JSON.stringify(appEventData.data, null, 4)
    });
    return clientAPI.executeAction('/MDKDevApp/Actions/PushNotification/PresentNotification/AsAlert.action').then(()=>{
        return appEventData.FetchResult.NewData; // 0
    });
}