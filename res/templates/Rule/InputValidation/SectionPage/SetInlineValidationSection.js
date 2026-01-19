export default function SetInlineValidationSection(context) {
  let controls = context.getPageProxy().getControl('SectionedTable0').getControls();
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
