export default function OnCreateMediaSuccess(pageProxy) {

  const objectKey = pageProxy.getBindingObject()['OrderId'];
  const orderReadLink= pageProxy.getBindingObject()['@odata.readLink'];

  const properties = {ObjectKey: objectKey};
  const entitySet = 'MyWorkOrderDocuments';
  const serviceName = '/MDKDevApp/Services/Amw.service';
  let promises = [];

  const readLinks = pageProxy.getClientData()['mediaReadLinks'];
  if (readLinks && orderReadLink) {
    for (let readLink of readLinks) {
      let links = [];
      let link = pageProxy.createLinkSpecifierProxy('WOHeader', 'MyWorkOrderHeaders', '', orderReadLink);
      links.push(link);
      link = pageProxy.createLinkSpecifierProxy('Document', 'Documents', '', readLink);
      links.push(link);
      promises.push(pageProxy.create(serviceName, entitySet, properties, links, {}));
    }
  }
  return Promise.all(promises).then(() => pageProxy.executeAction("/MDKDevApp/Actions/Toast/ToastAndClose.action"))
  .catch(() => pageProxy.executeAction("/MDKDevApp/Actions/OData/ODataCreateEntityFailureMessage.action"));  
}