export default function CheckValidation(pageProxy) {
  const container = pageProxy.getControl('SectionedTable0');

  let noteFormCell = container.getControl("NoteFormCell");
  const noteValue = noteFormCell.getValue();

  if (noteValue === undefined || noteValue === '') {
    noteFormCell.setValidationProperty('ValidationMessage', 'must have a value')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
  } else {
    noteFormCell.clearValidation();
  }
}