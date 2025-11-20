import libFormat from './Common/Library/CommonLibrary';

export default function DigitPickerOnValueChange(controlClientAPI){
	const tzListPkr = controlClientAPI.getPageProxy().getControl('FormCellContainerMDK5090').getControl('Digitpkr');
	let selectedValue = tzListPkr.getValue()[0].ReturnValue;
	try {
		let mainPage = controlClientAPI.evaluateTargetPathForAPI('#Page:SeamDevApp');
		const pageData = mainPage.getClientData();
		pageData['DigitOption'] = selectedValue;
		try {
			let pageProxy = controlClientAPI.evaluateTargetPathForAPI('#Page:MDK5090');
			if(pageProxy != undefined) {
				let fcContainer = pageProxy.getControl('FormCellContainerMDK5090');
				var controlsInFC = fcContainer.getControls();
				if (controlsInFC) {
					for (var i = 0; i < controlsInFC.length; i++) {
						if(controlsInFC[i].getName().substr(0,1) === 'N') {
							libFormat.formatNumberValue(controlClientAPI,true,controlsInFC[i].getName());     
						}
					}
				}
			}
		}
		catch(err2) {
			console.log(err2);
		}
	}
	catch(err){
		console.log(err);
	}
}