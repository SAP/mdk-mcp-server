/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function getSeparatorVisible(context) {
    let control = context.getPageProxy().getControl('SectionedTable0').getControl('TitleNote');
    let validation = control.getValidation();
    alert("Separator visible is: " + validation.getSeparatorVisible());
}