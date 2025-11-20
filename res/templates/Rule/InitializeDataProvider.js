// export option #1 using default es6 syntax
export default function InitializeDataProvider(clientAPI) {
  return clientAPI.executeAction('/MDKDevApp/Actions/OData/InitializeOfflineOData.action');
}
