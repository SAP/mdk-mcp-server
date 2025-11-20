export default function OnODataUploadSuccess(clientAPI) {
   clientAPI.read('/MDKDevApp/Services/Amw.service', 'ErrorArchive', []).then( result => {
       if (result && result.length > 0) {
           console.log(`Upload done with business error. ErrorArchive.length= ${result.length}`)
           return clientAPI.executeAction('/MDKDevApp/Actions/OData/ODataUploadSuccessWithBusinessErrorMessage.action');
       } else {
           return clientAPI.executeAction('/MDKDevApp/Actions/OData/ODataUploadSuccessMessage.action');
       }
   }).catch((error) => console.log('------ERROR--------' + error)) ;
}