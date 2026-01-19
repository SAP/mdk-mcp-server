/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function getStyles(context) {
    let control = context.getPageProxy().getControl('SectionedTable0').getControl('TitleNote');
    let validation = control.getValidation();
    alert("Validation view style is: " + JSON.stringify(validation.getStyles()));
}