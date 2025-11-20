export default function ReadServiceForChartCard(controlProxy) {
  const properties = ['CategoryName','CategorySales'];
  const entitySet = 'Category_Sales_for_1997';
  const serviceName = '/MDKDevApp/Services/ChartCardCollection.service';
  const queryOptions = '';
  return controlProxy.read(serviceName, entitySet, properties, queryOptions)
    .then((result) => {
      let CategoryName = [];
      let CategorySales = [];
      for (let i = 0; i < result.length; i++){
        var res = result.getItem(i);
        CategoryName.push(res.CategoryName);
        CategorySales.push(res.CategorySales);
      }
    return {
      CategoryName: CategoryName,
      CategorySales: [CategorySales]
    }
  })
};
