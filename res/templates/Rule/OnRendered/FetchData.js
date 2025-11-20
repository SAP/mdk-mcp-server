export default function FetchData(sectionProxy) {
  const entitySet = "Entities";
  const serviceName = "/MDKDevApp/Services/EchoV4.service";
  const queryOptions = "$top=1";
  const properties = [];
  return sectionProxy.read(serviceName, entitySet, properties, queryOptions).then((result) => {
    console.log("Lenght of the Result is:" + result.length);
    let row = result.getItem(0);
    console.log("requiredString using row is:"+ row['requiredString']);
    return {
    	'requiredString': row['requiredString']
    };
  })
}