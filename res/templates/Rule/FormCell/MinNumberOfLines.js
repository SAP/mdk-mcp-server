export default function MinNumberOfLines(context) {
  let noteControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:NoteFormCell2');
  noteControlProxy.setMinNumberOfLines(10);
}
