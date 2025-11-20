/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function setVisible(context) {
    let control = context.getPageProxy().getControl('FormCellContainer').getControl('TitleNote');
    let validation = control.getValidation();
    let visible = validation.getVisible();
    validation.setVisible(!visible);
    control.redraw();
}