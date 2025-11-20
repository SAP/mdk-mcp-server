export default function ReadServiceForOrders(controlProxy) {
  const entitySet = 'MyWorkOrderHeaders';
  const serviceName = '/MDKDevApp/Services/Amw.service';
  const queryOptions = '';
  const returnValue = 'OrderId';
  const displayValue = 'OrderDescription';
  const properties = [returnValue, displayValue];
  const pageProxy = controlProxy.getPageProxy();

  return pageProxy.read(serviceName, entitySet, properties, queryOptions)
    .then((result) => {
      result = result || [];
      return Array.from(result, item => ({
        ReturnValue: item[returnValue],
        DisplayValue: `${item[returnValue]} - ${item[displayValue]}` || '-',
      }));
    });
}
