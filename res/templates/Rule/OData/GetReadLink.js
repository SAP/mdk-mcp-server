export default function GetReadLink(clientAPI) {
  const entitySet = 'MyWorkOrderHeaders';
  const serviceName = '/MDKDevApp/Services/Amw.service';
  const queryOptions = `$filter=OrderId eq '4000019'`;
  return clientAPI.read(serviceName, entitySet, [], queryOptions).then( result => {
       if (result && result.length > 0) {
           return result.getItem(0)['@odata.readLink']
       } else {
           console.log('Can not find readlink based on query option')
           return '';
       }
   }).catch((error) => console.log('------ERROR--------' + error)) ;
}
