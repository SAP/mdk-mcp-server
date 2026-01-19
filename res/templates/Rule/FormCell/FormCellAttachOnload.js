export default function FormCellAttachOnload(context) {
  let prevSrcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Previous/#Control:attachment_src');
  let prevDestAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Previous/#Control:attachment_dest');

  let srcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_src');
  let destAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_dest');

  srcAttachControlProxy.setValue([...(prevSrcAttachControlProxy.getValue() || [])]);
  destAttachControlProxy.setValue([...(prevDestAttachControlProxy.getValue() || [])]);
}
