export default function ReadContentInSendPOSTMobileServiceRequest(controlProxy) {
let example = function(controlProxy) {
	let destination = 'SampleService';
	let entityRequest = 'ProductTexts';
	let requestPath = destination + '/' + entityRequest;

	let requestBodyJSON = {
		'Name': 'Test Product',
		'ProductId': 'TP-' + Math.floor(1000 + Math.random() * 9000),
		'ShortDescription': 'Test Product created by Send POST Request'
	}

	let params = {
		'method': 'POST',
		'header': {
			'Accept':'application/json',
			'content-type':'application/json'
		},
		'body': JSON.stringify(requestBodyJSON)
	};

	controlProxy.sendMobileServiceRequest(requestPath, params).then((response) => {
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
return example.toString();
}
