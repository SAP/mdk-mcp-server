export default function AttachmentOpenDefault(clientAPI) {
  let controlProxy = clientAPI.evaluateTargetPathForAPI('#Page:-Current/#Control:Attachment2');
  if (controlProxy) {
    const binding = clientAPI.getPageProxy().getActionBinding();
    controlProxy.openAttachmentItem(binding.index);
  }
}
