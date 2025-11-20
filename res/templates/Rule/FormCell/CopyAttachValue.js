export default function CopyAttachValue(context) {
  let srcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_src');
  let destAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_dest');

  destAttachControlProxy.setValue([...(srcAttachControlProxy.getValue() || [])]);
}
