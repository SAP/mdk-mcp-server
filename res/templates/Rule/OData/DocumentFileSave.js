let fs = require('@nativescript/core/file-system');
import DocumentActionBinding from './DocumentActionBinding';

export default function DocumentFileSave(pageProxy) {
  const binding = DocumentActionBinding(pageProxy);
  let readLink = binding['@odata.readLink'];
  var filename = binding.FileName

  if (readLink && filename) {
    var tempDir = fs.knownFolders.temp();
    var attachmentPath = fs.path.join(tempDir.path, filename);
    var attachmentFile = fs.File.fromPath(attachmentPath);
    attachmentFile.writeSync(pageProxy.getClientData()[readLink], err => {
      attachmentFile.remove();
      return pageProxy.executeAction('/MDKDevApp/Actions/Document/OpenDocumentFailure.action');
    });

    pageProxy.setActionBinding({
      'Path': attachmentPath,
    });

    return pageProxy.executeAction('/MDKDevApp/Actions/Banner/MediaDownloadComplete.action');
  }
}