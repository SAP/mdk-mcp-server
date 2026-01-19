export default function UpdateValidationView(controlProxy) {
	if (!controlProxy.getValue()) {
	  	controlProxy.setValidationProperty('ValidationMessage', 'Validation Message')
										.setValidationProperty('ValidationMessageColor', '000000')
										.setValidationProperty('SeparatorBackgroundColor', 'ffffff')
										.setValidationProperty('SeparatorIsHidden', false)
										.setValidationProperty('ValidationViewBackgroundColor', 'ff6666')
										.setValidationProperty('ValidationViewIsHidden', false)
										.applyValidation();
	} else {
		controlProxy.setValidationProperty('ValidationViewIsHidden', true)
										.applyValidation();
	}
}
