/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function setStyles(context) {
    let control = context.getPageProxy().getControl('FormCellContainer').getControl('TitleNote');
    let validation = control.getValidation();
    let styles = {"Message": "ChartContentSeriesTitle", "ValidationView": "background-yellow1"};
    validation.setStyles(styles);
    control.redraw();
}