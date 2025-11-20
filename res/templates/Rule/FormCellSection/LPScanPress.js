export default function LPScanPress(clientAPI) {
  if (!global.isCustomScan) {
    return Promise.reject();
   } 
  const id = clientAPI.showActivityIndicator('Wait scanning is in progress...');
  return new Promise(resolve => {
     setTimeout(() => {
       resolve("auto");
       clientAPI.dismissActivityIndicator(id);
     }, 5 * 1000);
   });
}