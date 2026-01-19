export default function ContainerReset(context) {
  let containerProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:FormCellContainer');
  containerProxy.reset();
}