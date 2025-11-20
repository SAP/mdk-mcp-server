export default function DumpReadLink(pageProxy) {
  let key = pageProxy.getActionBinding()['@odata.readLink'];
  if (key) {
    console.log(pageProxy.getClientData()[key].length + ' data bytes were read');
  }
}