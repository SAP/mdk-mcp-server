/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function setStyles(context) {
    let control = context.getPageProxy().getControl('SectionedTable0').getControl('TitleNote');
    let validation = control.getValidation();
    let styles = {"Message": "ChartContentSeriesTitle", "ValidationView": "background-yellow1"};
    validation.setStyles(styles);
    control.redraw();
}