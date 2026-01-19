export default function OnDidUpdate(clientAPI) {
	return clientAPI.executeAction('/MDKDevApp/Actions/OData/InitializeOfflineOData.action').then(
		(success) => Promise.resolve(success),
		(failure) => Promise.reject('Offline OData Initialization Failed'));
}
