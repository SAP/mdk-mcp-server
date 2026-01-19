export default function SwitchImage(context) {
  let pageProxy = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  let currentImage = pageProxy.getClientData()['ImageSectionImage'];
  if (currentImage == undefined) {
    currentImage = 0
  }
  currentImage = currentImage + 1;
  if (currentImage === 8) {
    currentImage = 0
  }

  let currentImagePath = '/MDKDevApp/Images/waterfall_panorama.png';
  switch(currentImage) {
    case 0: currentImagePath = '/MDKDevApp/Images/waterfall_panorama.png'; break;
    case 1: currentImagePath = '/MDKDevApp/Images/waterfall_panorama_small.png'; break;
    case 2: currentImagePath = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/2000px-SAP_2011_logo.svg.png'; break;
    case 3: currentImagePath = 'res://icon'; break;
    case 4: currentImagePath = '/MDKDevApp/Images/ImageCollection/location8pdf.pdf'; break;
    case 5: currentImagePath = '/MDKDevApp/Images/ImageCollection/location8.png'; break;
    case 6: currentImagePath = 'sap-icon://home'; break;
    case 7: currentImagePath = 'font://&#xe05d;'; break;
    default: currentImagePath = '/MDKDevApp/Images/waterfall_panorama.png'; break;
  }

  pageProxy.getClientData()['ImageSectionImage'] = currentImage;
  pageProxy.getClientData()['ImageSectionImagePath'] = currentImagePath;
  pageProxy.getClientData()['ImageSectionImageName'] = currentImagePath.split("/").pop();

  return context.getPageProxy().redraw();
}