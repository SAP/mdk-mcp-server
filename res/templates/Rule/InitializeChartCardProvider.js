// export option #1 using default es6 syntax
export default function InitializeChartCardProvider(clientAPI) {
  return clientAPI.executeAction('/MDKDevApp/Actions/OData/InitializeOfflineChartData.action');
}
