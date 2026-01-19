/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function CheckDevicesCompliant(clientAPI) {

    var isRootDevices = clientAPI.isDeviceCompliant();    
    alert("DevicesCompliance is: " + isRootDevices); 
    
}