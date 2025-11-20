export default function ResetLabelFormCell(context) {
  let targetPath = '#Page:-Current/#Control:LabelFormCell'
  let controlProxy = context.evaluateTargetPathForAPI(targetPath);
  if (controlProxy) {
    controlProxy.reset();
  }
}
