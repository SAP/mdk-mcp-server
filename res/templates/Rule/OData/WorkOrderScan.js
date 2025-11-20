import { reject } from "underscore";

export default function WorkOrderScan(clientAPI) {

const id = clientAPI.showActivityIndicator('Wait scanning is in progress...');
 return new Promise(function(resolve, reject) {  
  setTimeout(() => {;
    clientAPI.dismissActivityIndicator(id)
      if (global.isCustomScan) {
        resolve('4000270');
      } else {
        reject()
      }
    }, 5 * 1000);
  });
}

 
