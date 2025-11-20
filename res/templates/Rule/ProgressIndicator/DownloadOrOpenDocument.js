let fs = require('@nativescript/core/file-system');

export default function DownloadOrOpenDocument(sectionedTableProxy) {
  const pageProxy = sectionedTableProxy.getPageProxy();
  const bindingObject = pageProxy.getActionBinding();
  const readLink = bindingObject["@odata.readLink"];
  const filename = bindingObject.FileName;
  const serviceName = '/MDKDevApp/Services/Amw.service';
  const entitySet = 'Documents';
  const pressedItem = pageProxy.getPressedItem();
  // the object table section proxy, which contains the feedback indicators and performs download/open in order to update the indicator state
  const objectTableSection = sectionedTableProxy.getSections()[0];

  // if (sectionedTableProxy.nativescript.platformModule.isAndroid) {
  //   if (sectionedTableProxy.downloadInProgressForPage('BDSDocumentMediaListPage')) {
  //     return pageProxy.executeAction('/MDKDevApp/Actions/Messages/AndroidDownloadInProgress.action');
  //   }
  // }
  
  // first we need to decide if the media exists locally or needs to be downloaded
  return sectionedTableProxy.isMediaLocal(serviceName, entitySet, readLink).then((mediaIsLocal) => {

    const tempDir = fs.knownFolders.temp();
    const attachmentPath = fs.path.join(tempDir.path, filename);
    const fileExists = fs.File.exists(attachmentPath);
    if (mediaIsLocal && fileExists) {
      // the media has been downloaded, we can open it -> the path needs to be provided in the action definition
      // or it should come from binding

      // persist the media data to local sandbox, so we can open it with the document viewer
      if (!bindingObject) {
        return pageProxy.executeAction('/MDKDevApp/Actions/OData/ODataDownloadFailure.action');
      }

      if (readLink) {
          pageProxy.setActionBinding({
            'FileName': attachmentPath
          });
          return pageProxy.executeAction('/MDKDevApp/Actions/Document/OpenRelatedDocument.action')
      }
    } else if (mediaIsLocal) {
      //  The media is on the offline store but the file hasn't been saved
      if (pageProxy.getClientData()[readLink]) {
        // we have the stream in client data, save and open
        const attachmentFile = fs.File.fromPath(attachmentPath);
        attachmentFile.writeSync(pageProxy.getClientData()[readLink], function (err) {
          attachmentFile.remove();
          return pageProxy.executeAction('/MDKDevApp/Actions/OData/ODataDownloadFailure.action');
        });

        pageProxy.setActionBinding({
          'FileName': attachmentPath
        });
        return pageProxy.executeAction('/MDKDevApp/Actions/Document/OpenRelatedDocument.action');
      } else {
        // the media stream has not been downloaded to the client, download and save
        objectTableSection.setIndicatorState("inProgress", pressedItem);
        return pageProxy.executeAction('/MDKDevApp/Actions/OData/DownloadMedia.action').then(() => {
          objectTableSection.setIndicatorState("open", pressedItem);
        }).catch(error => {
          objectTableSection.setIndicatorState("toDownload", pressedItem);
        });
      }
    } else {
      if (sectionedTableProxy.downloadInProgressForReadLink(readLink)) {
        return Promise.resolve();
      } else {
        // The media is on the server, we can download it
        // set the indicator's state to in progress and start the download
        objectTableSection.setIndicatorState("inProgress", pressedItem);
        return sectionedTableProxy.executeAction("/MDKDevApp/Actions/OData/DownloadDocumentStreams.action").catch(error => {
          objectTableSection.setIndicatorState("toDownload", pressedItem);
        });
      }
    }
  });
}