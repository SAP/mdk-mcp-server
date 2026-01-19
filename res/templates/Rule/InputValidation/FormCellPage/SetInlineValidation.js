export default function SetInlineValidation(context) {
  let controls = context.getPageProxy().getControl('FormCellContainer').getControls();
  if (controls.length > 0) {
    controls.forEach((control) => {
      let message = "Validation message for " + control.getName();
      let validation = control.getValidation();
      let styles = {"Message": "ChartContentSeriesTitle", "ValidationView": "background-yellow1"};
      validation.setMessage(message)
      .setStyles(styles)
      .setVisible(true);
      control.redraw();
    })
  }
}
