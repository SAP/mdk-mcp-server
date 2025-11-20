/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function setSeparatorVisible(context) {
    let control = context.getPageProxy().getControl('FormCellContainer').getControl('TitleNote');
    let validation = control.getValidation();
    let visible = validation.getSeparatorVisible();
    validation.setSeparatorVisible(!visible);
    control.redraw();
}