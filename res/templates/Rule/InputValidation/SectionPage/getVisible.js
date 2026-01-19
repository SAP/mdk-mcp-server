/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function getVisible(context) {
    let control = context.getPageProxy().getControl('SectionedTable0').getControl('TitleNote');
    let validation = control.getValidation();
    alert("Validation view visible is: " + validation.getVisible());
}