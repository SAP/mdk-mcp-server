/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function setMessage(context) {
    let control = context.getPageProxy().getControl('SectionedTable0').getControl('TitleNote');
    let validation = control.getValidation();
    validation.setMessage("New Validation message").setVisible(true);
    control.redraw();
}