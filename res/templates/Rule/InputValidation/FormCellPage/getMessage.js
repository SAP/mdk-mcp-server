/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function getMessage(context) {
    let control = context.getPageProxy().getControl('FormCellContainer').getControl('TitleNote');
    let validation = control.getValidation();
    alert(validation.getMessage());
}