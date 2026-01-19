let fs = require("@nativescript/core/file-system");


export default function ErrorHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    const documents = fs.knownFolders.documents();

    if (appEventData && appEventData.ios) {
        let sError = 'Error ' + appEventData.ios + '\n';
        sError += 'Stacktrace: ' + appEventData.ios.stack;
        let loggerManager = clientAPI.getLogger();
        loggerManager.on();
        loggerManager.log(sError,'Error');
        loggerManager.off();
        console.log('Error saved to ' + documents.path);
    }
}
