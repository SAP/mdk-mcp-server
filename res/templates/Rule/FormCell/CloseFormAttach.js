export default function CloseFormAttach(context) {
  let prevSrcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Previous/#Control:attachment_src');
  let prevDestAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Previous/#Control:attachment_dest');

  let srcAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_src');
  let destAttachControlProxy = context.evaluateTargetPathForAPI('#Page:-Current/#Control:attachment_dest');

  prevSrcAttachControlProxy.setValue([...(srcAttachControlProxy.getValue() || [])]);
  prevDestAttachControlProxy.setValue([...(destAttachControlProxy.getValue() || [])]);

  context.executeAction('/MDKDevApp/Actions/Navigation/ClosePage.action');
}
