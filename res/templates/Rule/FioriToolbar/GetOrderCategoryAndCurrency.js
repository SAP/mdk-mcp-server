export default function GetOrderCategoryAndCurrency(controlProxy) {
  const properties = ['OrderCategory','OrderCurrency'];
  const entitySet = 'MyWorkOrderHeaders';
  const serviceName = '/MDKDevApp/Services/Amw.service';
  const queryOptions = '$top=1';
  return controlProxy.read(serviceName, entitySet, properties, queryOptions).then((result) => {
    result = result || [];
    let OrderCategory = [];
    let OrderCurrency = [];
    for (let i = 0; i < result.length; i++){
      var res = result.getItem(i);
      OrderCategory.push(res.OrderCategory);
      OrderCurrency.push(res.OrderCurrency);
    }
    return OrderCurrency[0] + OrderCategory[0];
  }).catch(err => {
    console.error(err);
    return "error";
  });
  
}
  