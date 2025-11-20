import libThis from './CommonLibrary';


export default class {
    /**
	 * Checks if listpicker value is empty
	 * @param {*} value
	 */
    static isListPickerSelectionEmpty(value) {
        if (value) {
            if (typeof value !== 'string') {
                if (value.hasOwnProperty('ReturnValue')) {
                    return value.ReturnValue.trim() === '';
                }
            } else {
                return value.trim() === '';
            }
        } else {
            return true;
        }
        
        return false;
    }

    /**
	 * Generate list picker items from key value pair
	 * @param {*} value
	 */
    static generateListPickerItems(keyValuePairs) {
        let results = [];
        let obj = new Object();
        for (const key of Object.keys(keyValuePairs)) {
            obj = new Object();
            obj.DisplayValue = keyValuePairs[key];
            obj.ReturnValue = key;
            results.push(obj);
        }
        return results;
    }

    /**
	 * Generate list picker items from key value pair
	 * @param {*} value
	 */
    static sortListPickerByDisplayValue(pickerItems) {
        return pickerItems.sort(function(a, b) {
            var nameA = a.DisplayValue.toUpperCase(); // ignore upper and lowercase
            var nameB = b.DisplayValue.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
        });
    }

    // For MDK-5090
    static formatNumberValue(context,bOnValueChange,controlName){
		let digit = "1";
		if (bOnValueChange){
			const dgListPkr = context.getPageProxy().getControl('FormCellContainerMDK5090').getControl('Digitpkr');
			let ctrlDisplay = context.getPageProxy().getControl('FormCellContainerMDK5090').getControl(controlName);
			
			digit = dgListPkr.getValue()[0].ReturnValue;
			ctrlDisplay.setValue(digit);
		}
		else {
			let mainPage = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
			const pageData = mainPage.getClientData();
        	
        	if (pageData.hasOwnProperty('DigitOption')) {
                digit =  pageData['DigitOption'];
			}
			return digit;
		}
	}
}
