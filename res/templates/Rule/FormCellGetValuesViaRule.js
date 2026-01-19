export default function FormCellGetValuesViaRule(controlClientAPI) {

  const titleCell = controlClientAPI.evaluateTargetPath('#Page:Formcell/#Control:TitleFormCell');
  let titleValue = titleCell.getValue();

  const noteCell = controlClientAPI.evaluateTargetPath('#Page:Formcell/#Control:NoteFormCell');
  let noteValue = noteCell.getValue();
 
  const durationCell = controlClientAPI.evaluateTargetPath('#Page:Formcell/#Control:DurationControl');
  let durationValue = durationCell.getValue();

  const datePickerCell = controlClientAPI.evaluateTargetPath('#Page:Formcell/#Control:DatePicker');
  let dateValue = datePickerCell.getValue();

  alert(titleValue + '\n' + noteValue + '\n' + durationValue + '\n' + dateValue);
}
