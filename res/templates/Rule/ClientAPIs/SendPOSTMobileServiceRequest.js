var dialogs = require("@nativescript/core/ui/dialogs");

export default function SendPOSTMobileServiceRequest(controlProxy) {
	let destination = 'SampleService';
	let entityRequest = 'ProductTexts';
	let requestPath = destination + '/' + entityRequest;
	
	// without user id
	let sapPassportHeaderValue = controlProxy.getSAPPassportHeaderValue('MDK', 'action', 'Http', 'SFSF', 'prevComponentName');

	let requestBodyJSON = {
		'Name': 'Test Product',
		'ProductId': 'TP-' + Math.floor(1000 + Math.random() * 9000),
		'ShortDescription': 'Test Product created by Send POST Request'
	}

	let params = {
		'method': 'POST',
	'header': {
		'Accept':'application/json',
		'content-type':'application/json',
		'SAP-PASSPORT': sapPassportHeaderValue,
	},
	'body': JSON.stringify(requestBodyJSON)
	};

	console.log('request header: ' + JSON.stringify(params.header));

	controlProxy.sendRequest(requestPath, params).then((response) => {
		let result = 'statusCode = ' + response.statusCode;
		if (response.content) {
			result = result + '\n' + response.content.toString();
		}
		dialogs.alert(result);
	}, (error) => {
		let errorMsg = 'error = ' + error.message;
		dialogs.alert(errorMsg)
    });
}
