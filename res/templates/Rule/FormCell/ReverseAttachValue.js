export default function ReverseAttachValue(context) {
  let srcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_src');
  let destAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_dest');

  srcAttachControlProxy.setValue(([...(srcAttachControlProxy.getValue() || [])]).reverse());
  destAttachControlProxy.setValue(([...(destAttachControlProxy.getValue() || [])]).reverse());
}
