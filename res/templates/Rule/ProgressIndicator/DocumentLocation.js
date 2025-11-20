const fileSystem = require('@nativescript/core/file-system');

export default function DocumentLocation(sectionProxy) {
  const bindingObject = sectionProxy.getBindingObject();
  const entitySet = 'Documents';
  const filename = bindingObject.FileName;
  const readLink = bindingObject["@odata.readLink"];
  const serviceName = '/MDKDevApp/Services/Amw.service';

  return sectionProxy.isMediaLocal(serviceName, entitySet, readLink).then((mediaIsLocal) => {
    if (mediaIsLocal) {
      if (readLink && filename) {
        const tempDir = fileSystem.knownFolders.temp();
        const attachmentPath = fileSystem.path.join(tempDir.path, filename);
        if (fileSystem.File.exists(attachmentPath)) {
          // The media stream has been saved locally, it can be opened
          return 'On Client';
        }

        return 'Offline Store';
      }
    } else if (readLink && sectionProxy.downloadInProgressForReadLink(readLink)) {
      // the media is currently being downloaded
      return 'Downloading';
    } else {
      // The media is on the server, we can download it
      return 'On Server';
    }
  });
}
