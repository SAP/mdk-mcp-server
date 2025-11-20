
export default function CellEditableReset(context) {
  let controlProxy;
  controlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:ListPicker1');
  controlProxy.reset();

  controlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:DatePicker');
  controlProxy.reset();

  controlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:NoteFormCell');
  controlProxy.reset();
}