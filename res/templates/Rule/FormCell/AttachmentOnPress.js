import { ImageSource, knownFolders, path } from '@nativescript/core';

export default function AttachmentOnPress(clientAPI) {
  const binding = clientAPI.getPageProxy().getActionBinding();
  if (binding.index === 0) {
    clientAPI.open();
  } else if (binding.index === 1) {
    ImageSource.fromResource("download_icon").then((imageSource) => {
      const folderPath = knownFolders.documents().path;
      const fileName = "test.png";
      const filePath = path.join(folderPath, fileName);
      const saved = imageSource.saveToFile(filePath, "png");
      if (saved) {
        console.log("Image saved successfully!");
      }

      let newAttachmentEntry = clientAPI.createAttachmentEntry(filePath, binding.entitySet, binding.property, binding.readLink, binding.service);
      clientAPI.setValue(newAttachmentEntry, false);
      setTimeout(() => {
        clientAPI.open();
      }, 1000);
    });
  } else if (binding.index === 2) {
    clientAPI.executeAction('/MDKDevApp/Actions/Popover/Popover.action');
  } else {
    alert(clientAPI.getIndex() + '\n' + clientAPI.getValue().urlString);
  }
}
