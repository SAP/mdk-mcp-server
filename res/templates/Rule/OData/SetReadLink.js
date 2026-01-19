/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetReadLink(context) {
  const entitySet = 'MyWorkOrderHeaders';
  const service = '/MDKDevApp/Services/Amw.service';
  const values = context.evaluateTargetPath('#Page:CreateWorkOrderOperation/#Control:WorkOrder/#Value');
  const queryOptions = `$filter=OrderId eq '${values[0].ReturnValue}'`;
  return context.read(service, entitySet, [], queryOptions).then(result => {
    let readLink = '';
    if (result && result.length > 0) {
      readLink = result.getItem(0)['@odata.readLink'];
    } else {
      console.log('Can not find readlink based on query option')
      return '';
    }

    context.evaluateTargetPath('#Page:CreateWorkOrderOperation/#Control:ReadLink').setValue(readLink);
  });
}