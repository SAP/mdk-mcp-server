export default function CustomRead(controlProxy) {
  const properties = ['OperationNo'];
  const entitySet = 'MyWorkOrderOperations';
  const serviceName = '/MDKDevApp/Services/Amw.service';
  const queryOptions = '';
  return controlProxy.read(serviceName, entitySet, properties, queryOptions)
    .then((result) => {
      result = result || [];
      console.log('Custom read succeeded with ' + result.length + ' results.');
    }, (err) => {
      console.error(err);
    }).then(() => {
      return controlProxy.count(serviceName, entitySet, queryOptions)
        .then((result) => {
          console.log('count succeeded with ' + result);
        }, (err) => {
          console.error(err);
        });
    });
}
