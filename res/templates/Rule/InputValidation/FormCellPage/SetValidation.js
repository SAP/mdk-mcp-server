function ApplyValidation(element, message) {
  let backgroundColor = 'B0D450';
  let messageColor = '32363a';
  let separatorBackgroundColor = 'bb0000';

  element.setValidationProperty('ValidationMessage', message)
    .setValidationProperty('SeparatorIsHidden', false)
    .setValidationProperty('ValidationViewIsHidden', false)
    .setValidationProperty('ValidationViewBackgroundColor', backgroundColor)
    .setValidationProperty('ValidationMessageColor', messageColor)
    .setValidationProperty('SeparatorBackgroundColor', separatorBackgroundColor)
    .applyValidation();
}

export default function SetValidation(context) {
  let controls = context.getPageProxy().getControl('FormCellContainer').getControls();
  let container = context.getPageProxy().getControl('FormCellContainer');
   if (controls.length > 0) {
     controls.forEach((control) => {
       let message = "Validation message for " + control.getName();
       ApplyValidation(control, message);
     })
   }
  container.redraw();
}
