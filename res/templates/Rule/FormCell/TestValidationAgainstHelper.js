export default function TestValidationAgainstHelper(pageProxy) {
  const container = pageProxy.getControl('FormCellContainer');

  if (container != null) {
    let noteFormCell = container.getControl("NoteFormCell");
    setValidation(noteFormCell);

    let titleFormCell = container.getControl("TitleFormCell");
    setValidation(titleFormCell);

    let simpleProperty = container.getControl("SimplePropertyFormCell");
    setValidation(simpleProperty);

    let switchCell = container.getControl("SwitchCellSetViaRule");
    setValidation(switchCell);

    let signatureCell = container.getControl("SignatureCell");
    setValidation(signatureCell);

    let inlineSignatureCell = container.getControl("InlineSignatureCell");
    setValidation(inlineSignatureCell);
  }
}

function setValidation(cell) {
  var value = cell.getValue();
  if (value === undefined || value === '' || (typeof(value) == 'boolean' && value == false)) {
    cell.setValidationProperty('ValidationMessage', 'Empty value detected')
      .setValidationProperty('SeparatorIsHidden', false)
      .setValidationProperty('ValidationViewIsHidden', false)
      .setValidationProperty('ValidationViewBackgroundColor', 'fffa00')
      .setValidationProperty('ValidationMessageColor', 'ff0000')
      .setValidationProperty('SeparatorBackgroundColor', '000000')
      .applyValidation();
  } else {
    cell.clearValidation();
  }
}
