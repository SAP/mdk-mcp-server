let controlNum = 0;
export default function ResetCell(context) {
  let items = [];
  
  if (controlNum === 0) {
    items = ['#Page:-Current/#Control:DatePicker', '#Page:-Current/#Control:NoteFormCell2'];
    controlNum++;
  } else if (controlNum === 1) {
    items = ['#Page:-Current/#Control:SwitchCellGetViaRule', '#Page:-Current/#Control:ListPicker1'];
    controlNum++;
  } else {
    items = ['#Page:-Current/#Control:SegmentedControl2', '#Page:-Current/#Control:SignatureCell1', '#Page:-Current/#Control:SignatureCell', '#Page:-Current/#Control:InlineSignatureCell'];
    controlNum = 0;
  }

  for (let item of items) {
    let controlProxy = context.evaluateTargetPathForAPI(item);
    if (controlProxy) {
      controlProxy.reset();
    }
  }
}
