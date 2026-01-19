export default function TotalWorkOrders(controlProxy) {
  const entitySet = 'MyWorkOrderHeaders';
  const serviceName = '/MDKDevApp/Services/Amw.service';
  const queryOptions = '';
  return controlProxy.count(serviceName, entitySet, queryOptions).then((result) => {
    return `${result} Work Orders`;
  }).catch(err => {
    console.error(err);
    return 0;
  });
}