let fs = require("@nativescript/core/file-system");

export default function AppExit(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    const documents = fs.knownFolders.documents();

    if (appEventData && appEventData.ios) {
        let loggerManager = clientAPI.getLogger();
        loggerManager.on();
        loggerManager.setLevel('Info');
        loggerManager.log('Executing AppExit action.\n','Info');
        loggerManager.off();
        console.log('Executed AppExit action. Log output saved to: ' + documents.path);
    }
	return clientAPI.executeAction('/MDKDevApp/Actions/OData/CloseOfflineOData.action');
}
