// export option #1 using default es6 syntax
export default function InitializeOnlineChartCard(clientAPI) {
    return clientAPI.executeAction('/MDKDevApp/Actions/CreateChartCardService.action');
  }