function _filenameFromUri(attachment) {
  const uri = attachment.urlString;
  const segments = uri.split('/');
  return segments[segments.length - 1];
}

export default function UpdateAttachments(control) {
  control.getClientData().AddedAttachments.forEach((attachment) => {
    const filename = _filenameFromUri(attachment);
    let message = "ATTACHMENT: " + filename + "\n";
    dialogs.alert(message)
    if (!_attachmentExists(filename)) {
      _processAddedAttachments(attachment);
    }
  });
}