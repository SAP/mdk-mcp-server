const fileSystem = require('@nativescript/core/file-system');

export default function IsMediaLocal(clientAPI) {
  const bindingObject = clientAPI.getBindingObject();
  const entitySet = 'Documents';
  const filename = bindingObject.FileName;
  const readLink = bindingObject["@odata.readLink"];
  const serviceName = '/MDKDevApp/Services/Amw.service';

  return clientAPI.isMediaLocal(serviceName, entitySet, readLink).then((mediaIsLocal) => {

    if (mediaIsLocal) {
      if (readLink && filename) {
        const attachmentPath = fileSystem.path.join(fileSystem.knownFolders.temp().path, filename);
        if (!fileSystem.File.exists(attachmentPath)) {
          return 'Offline Store';
        }
      }
      return 'Local';
    }

    return 'Remote';
  });
}
