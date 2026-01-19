let fs = require('@nativescript/core/file-system');

export default function ShowSignature(controlProxy) {
  const signatureObject = controlProxy.getValue();
  if (signatureObject.content && signatureObject.content.length && signatureObject.content.length > 0) {
    const filename = "mysignature.png";
    // See: https://docs.nativescript.org/ns-framework-modules/file-system#knownfolders-methods
    const urlPath = fs.path.join(fs.knownFolders.documents().path, filename);
    const pageAPI = controlProxy.getPageProxy();
    pageAPI.setActionBinding({
      'FileName': urlPath
    });

    let needRemove = fs.File.exists(urlPath);
    let file = fs.File.fromPath(urlPath);
    let removePromise = needRemove ? file.remove() : Promise.resolve();

    return removePromise.then(() => {
      return file.write(signatureObject.content);
    }).then(() => {
      return pageAPI.executeAction('/MDKDevApp/Actions/Document/OpenRelatedDocument.action');
    }).catch((error) => {
      console.log(error);
      console.log(urlPath);
      alert(error);
    });
  }
}
