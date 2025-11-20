/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetAppName(clientAPI) {
    var appName = clientAPI.getAppName();

    alert("AppName is: " + appName);
}