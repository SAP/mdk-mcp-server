function IsOverdueDate(date) {
  if (typeof date === 'object') {
    if (date < new Date()) {
      return true;
    }
  }

  return false;
}

function IsEmpty(text) {
  return !text || text.length <= 0;
}

function ApplyValidation(element, message, firstStyle) {
  let backgroundColor = firstStyle ? 'fffa00' : 'ffebeb';
  let messageColor = firstStyle ? 'ff0000' : '32363a';
  let separatorBackgroundColor = firstStyle ? '000000' : 'bb0000';

  element.setValidationProperty('ValidationMessage', message)
    .setValidationProperty('SeparatorIsHidden', false)
    .setValidationProperty('ValidationViewIsHidden', false)
    .setValidationProperty('ValidationViewBackgroundColor', backgroundColor)
    .setValidationProperty('ValidationMessageColor', messageColor)
    .setValidationProperty('SeparatorBackgroundColor', separatorBackgroundColor)
    .applyValidation();
}

export default function FormValid(context) {
  let result = true;

  let segment_style = context.evaluateTargetPathForAPI('#Page:Formcell_Validation_Page/#Control:StyleSegment');
  let firstStyle = segment_style.getValue()[0].ReturnValue === 'Style 1';

  let note_title = context.evaluateTargetPathForAPI('#Page:Formcell_Validation_Page/#Control:TitleNote');
  if (note_title) {
    let text = note_title.getValue();
    if (IsEmpty(text)) {
      result = false;
      ApplyValidation(note_title, 'Cannot be empty!', firstStyle);
    } else {
      note_title.clearValidation();
    }
  }

  let note_title2 = context.evaluateTargetPathForAPI('#Page:Formcell_Validation_Page/#Control:TitleNote2');
  if (note_title2) {
    let text = note_title2.getValue();
    if (IsEmpty(text)) {
      result = false;
      ApplyValidation(note_title2, 'Cannot be empty!', firstStyle);
    } else {
      note_title2.clearValidation();
    }
  }

  let datepicker_duedate = context.evaluateTargetPathForAPI('#Page:Formcell_Validation_Page/#Control:DueDate');
  if (datepicker_duedate) {
    let due_date = datepicker_duedate.getValue();
    if (IsOverdueDate(due_date)) {
      result = false;
      ApplyValidation(datepicker_duedate, 'Invalid Date, Must > Now!', firstStyle);
    } else {
      datepicker_duedate.clearValidation();
    }
  }

  let inlineSignature = context.evaluateTargetPathForAPI('#Page:Formcell_Validation_Page/#Control:InlineSignature');
  if (inlineSignature) {
    let signatureValue = inlineSignature.getValue();
    if (!(signatureValue && signatureValue.content && signatureValue.content.length && signatureValue.content.length > 0)) {
      result = false;
      ApplyValidation(inlineSignature, 'Cannot be empty inline signature!', firstStyle);
    } else {
      inlineSignature.clearValidation();
    }
  }

  let signatureCell = context.evaluateTargetPathForAPI('#Page:Formcell_Validation_Page/#Control:SignatureCell');
  if (signatureCell) {
    let signatureValue = signatureCell.getValue();
    if (!(signatureValue && signatureValue.content && signatureValue.content.length && signatureValue.content.length > 0)) {
      result = false;
      ApplyValidation(signatureCell, 'Cannot be empty signature!', firstStyle);
    } else {
      inlineSignature.clearValidation();
    }
  }

  if (result) {
    return context.executeAction('/MDKDevApp/Actions/Toast/Success.action');
  }
}
