var dialogs = require('@nativescript/core/ui/dialogs');

export default function OnWillUpdate(clientAPI) {
	return dialogs.confirm("Update now?").then((result) => {
		console.log("Update now? " + result);
		if (result === true) {
			return clientAPI.executeAction('/MDKDevApp/Actions/OData/CloseOfflineOData.action').then(
				(success) => Promise.resolve(success),
				(failure) => Promise.reject('Offline Odata Close Failed'));
		} else {
			return Promise.reject('User Deferred');
		}
	});
}
