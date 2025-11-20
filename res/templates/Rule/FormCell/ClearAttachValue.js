export default function ClearAttachValue(context) {
  let srcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_src');
  let destAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_dest');

  srcAttachControlProxy.setValue(null);
  destAttachControlProxy.setValue(undefined);
}
