export default function DigitPickerValue(controlClientAPI){
	let mainPage = controlClientAPI.evaluateTargetPathForAPI('#Page:SeamDevApp');
	const pageData = mainPage.getClientData();
	if (pageData.hasOwnProperty('DigitOption')) {
		return pageData['DigitOption'];
	} 
	return "1";
}