var dialogs = require("@nativescript/core/ui/dialogs");

export default function ConfirmClose(context) {
	var appEventData = context.getAppEventData();
	if(appEventData) {
		// since dialogs.confirm is not ui blocking
		// we have to cancel back nav first 
		appEventData.cancel = true;
	}
  dialogs.confirm({
    title: "Confirmation",
    message: "Do you want to close this page?",
    okButtonText: "OK",
    cancelButtonText: "Cancel"
  }).then(function (result) {
		if(result) {
			// call ClosePage action to nav back
			context.executeAction('/MDKDevApp/Actions/Navigation/ClosePage.action');
		}
  });
}
