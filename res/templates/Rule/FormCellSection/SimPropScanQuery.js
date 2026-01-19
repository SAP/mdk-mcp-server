export default function SimPropScanQuery(clientAPI) {
   const id = clientAPI.showActivityIndicator('Wait scanning is in progress...');
   return new Promise(resolve => {
   setTimeout(() => {
     resolve("4000270");
     clientAPI.dismissActivityIndicator(id); 
   }, 5 * 1000);
 });
}