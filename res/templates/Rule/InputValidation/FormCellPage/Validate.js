export default function Validate(context) {
  let control = context.getPageProxy().getControl('FormCellContainer').getControl('TitleNote');
  let value = Number(control.getValue());
  let message;
  let styles;
  let visible = false;
  if (value < 5) {
    message = "Value cannot be <5";
    styles = {"Message": "ChartContentSeriesTitle", "ValidationView": "background-yellow1"};
    visible = true;
  } else if (value <= 10) {
    message = "Value looks good but better >10";
    styles = {"Message": "ValidationMessage", "ValidationView": "ValidationView"};
    visible = true;
  }

  let validation = control.getValidation();
  validation.setMessage(message)
    .setStyles(styles)
    .setVisible(visible);
  control.redraw();
}
