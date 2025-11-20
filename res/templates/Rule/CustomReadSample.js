export default function CustomReadSample(controlProxy) {
  const properties = [];
  const entitySet = 'Products';
  const serviceName = '/MDKDevApp/Services/Sample.service';
  const queryOptions = '';
  return controlProxy.read(serviceName, entitySet, properties, queryOptions)
  .then((result) => {
    result = result || [];
    console.log('Custom read succeeded with ' + result.length + ' results.');
  }, (err) => {
    console.error(err);
  });
}
