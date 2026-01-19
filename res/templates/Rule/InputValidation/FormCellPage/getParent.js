/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function getParent(context) {
    let control = context.getPageProxy().getControl('FormCellContainer').getControl('TitleNote');
    let validation = control.getValidation();
    let parent = validation.getParent();
    parent.setCaption("New Caption");
    control.redraw();
    alert(validation.getParent().getType());
}