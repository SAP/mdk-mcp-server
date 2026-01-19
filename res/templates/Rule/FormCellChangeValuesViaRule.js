export default function FormCellChangeValuesViaRule(controlClientAPI) {

  const titleCell = controlClientAPI.evaluateTargetPathForAPI('#Page:Formcell/#Control:TitleFormCell');
  titleCell.setValue('New Title via rule');

  const noteCell = controlClientAPI.evaluateTargetPathForAPI('#Page:Formcell/#Control:NoteFormCell');
  noteCell.setValue('Note via rule');
 
  const durationCell = controlClientAPI.evaluateTargetPathForAPI('#Page:Formcell/#Control:DurationControl');
  durationCell.setValue(35);

  const datePickerCell = controlClientAPI.evaluateTargetPathForAPI('#Page:Formcell/#Control:DatePicker');
  datePickerCell.setValue('2017-04-20 13:42:00 +0300');

  const formcellCont = controlClientAPI.evaluateTargetPathForAPI('#Page:Formcell/#Control:FormCellContainer');
  formcellCont.redraw();
}
