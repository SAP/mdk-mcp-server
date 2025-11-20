/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function setSeparatorVisible(context) {
    let control = context.getPageProxy().getControl('SectionedTable0').getControl('TitleNote');
    let validation = control.getValidation();
    let visible = validation.getSeparatorVisible();
    validation.setSeparatorVisible(!visible);
    control.redraw();
}