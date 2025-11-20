export default function CustomReadSvbBasic(controlProxy) {
  const properties = [];
  const entitySet = 'WorkCenters';
  const serviceName = '/MDKDevApp/Services/SvbBasic.service';
  const queryOptions = '';
  return controlProxy.read(serviceName, entitySet, properties, queryOptions)
  .then((result) => {
    result = result || [];
    console.log('Custom read succeeded with ' + result.length + ' results.');
  }, (err) => {
    console.error(err);
  });
}
