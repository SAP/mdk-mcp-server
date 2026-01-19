export default function ReadServiceForKPIHeader(controlProxy) {

    const properties = ['CategorySales'];
    const entitySet = 'Category_Sales_for_1997';
    const serviceName = '/MDKDevApp/Services/ChartCardCollection.service';
    const queryOptions = '$top=1';
    return controlProxy.read(serviceName, entitySet, properties, queryOptions)
      .then((result) => {

        let Hours;
        let Minutes;
        let Seconds;
        let CategorySales;
        let ExpectedSales;
        let FractionSales;
        let FractionSalesStr;

        var res = result.getItem(0);
        CategorySales = Math.floor(res.CategorySales%24);

        Hours = CategorySales;
        Minutes = CategorySales + 5;
        Seconds = CategorySales + 12;
        ExpectedSales = CategorySales + 10;
        FractionSales = CategorySales/ExpectedSales;
        FractionSalesStr = CategorySales.toString() + "/" + ExpectedSales.toString();

      return {
        Hours: Hours,
        Minutes: Minutes,
        Seconds: Seconds,
        CategorySales: CategorySales,
        FractionSales: FractionSales,
        FractionSalesStr: FractionSalesStr,
      }
    })
  };
