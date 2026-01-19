export default function TestValidation(pageProxy) {
  const container = pageProxy.getControl('SectionedTable');

  let noteFormCell = container.getControl("Note");
  const noteValue = noteFormCell.getValue();

  if (noteValue === undefined || noteValue === '') {
    console.log(`invalid note value encountered ${noteValue}`);
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

  let simpleProperty = container.getControl("SimpleProperty");
  const simplePropertyValue = simpleProperty.getValue();

  if (simplePropertyValue === undefined || simplePropertyValue === '') {
    console.log(`invalid simple property value encountered ${simplePropertyValue}`);
    simpleProperty.setValidationProperty('ValidationMessage', 'must have a value')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
  } else {
    simpleProperty.clearValidation();
  }

  let duationPicker = container.getControl("DurationPicker");
  const durationValue = duationPicker.getValue();

  if (durationValue <= 3900) {
    console.log(`invalid duration encountered ${durationValue}`);
    duationPicker.setValidationProperty('ValidationMessage', 'pick a different duration')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
  } else {
    duationPicker.clearValidation();
  }

  let listPickerFormCell = container.getControl("ListPicker");
  const listPickerValue = listPickerFormCell.getValue();

  if (listPickerValue.length === 0) {
    console.log(`invalid note value encountered ${listPickerValue}`);
    listPickerFormCell.setValidationProperty('ValidationMessage', 'must pick a list item')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
  } else {
    listPickerFormCell.clearValidation();
  }

  let inlineSignature = container.getControl("InlineSignature");
  if (inlineSignature) {
    let signatureValue = inlineSignature.getValue();
    if (!(signatureValue && signatureValue.content && signatureValue.content.length && signatureValue.content.length > 0)) {
      inlineSignature.setValidationProperty('ValidationMessage', 'Cannot be empty inline signature!')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
    } else {
      inlineSignature.clearValidation();
    }
  }

  let signatureCell = container.getControl("SignatureCell");
  if (signatureCell) {
    let signatureValue = signatureCell.getValue();
    if (!(signatureValue && signatureValue.content && signatureValue.content.length && signatureValue.content.length > 0)) {
      signatureCell.setValidationProperty('ValidationMessage', 'Cannot be empty signature!')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
    } else {
      signatureCell.clearValidation();
    }
  }
}
