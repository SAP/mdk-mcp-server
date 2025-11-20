export default function StrictFileTypesOfAttachments(clientAPI) {
  const allowedFileTypes = clientAPI.getAllowedFileTypes();
  for (let i = 0; i < allowedFileTypes.length; i++) {
    allowedFileTypes[i] = allowedFileTypes[i].toLowerCase();
  }
  let attachments = clientAPI.getValue();
  console.log('You will have ' + attachments.length + ' files');
  let newAttachments = [];
  for (let i = 0; i < attachments.length; i++) {
    let fullFileName = attachments[i].urlStringWithFileName;
    if (!fullFileName) {
      fullFileName = attachments[i].urlString;
    }
    let extension = fullFileName.split('.').pop();
    if (allowedFileTypes.indexOf(extension.toLowerCase()) !== -1) {
      newAttachments.push(attachments[i]);
    }
  }
  if (newAttachments.length !== attachments.length) {
    console.log('You have ' + newAttachments.length + ' files');
    clientAPI.setValue(newAttachments);
  }
}
