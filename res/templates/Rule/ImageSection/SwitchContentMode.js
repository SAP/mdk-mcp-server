export default function SwitchContentMode(context) {
  let pageProxy = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  let currentImageContentMode = pageProxy.getClientData()['ImageSectionContentMode'];
  if (currentImageContentMode == undefined) {
    currentImageContentMode = 1
  }
  currentImageContentMode = currentImageContentMode + 1;
  if (currentImageContentMode === 13) {
    currentImageContentMode = 0
  }

  let currentImageContentModeStr = 'ScaleAspectFit';
  switch(currentImageContentMode) {
    case 0: currentImageContentModeStr = 'ScaleToFill'; break;
    case 1: currentImageContentModeStr = 'ScaleAspectFit'; break;
    case 2: currentImageContentModeStr = 'ScaleAspectFill'; break;
    case 3: currentImageContentModeStr = 'Redraw'; break;
    case 4: currentImageContentModeStr = 'Center'; break;
    case 5: currentImageContentModeStr = 'Top'; break;
    case 6: currentImageContentModeStr = 'Bottom'; break;
    case 7: currentImageContentModeStr = 'Left'; break;
    case 8: currentImageContentModeStr = 'Right'; break;
    case 9: currentImageContentModeStr = 'TopLeft'; break;
    case 10: currentImageContentModeStr = 'TopRight'; break;
    case 11: currentImageContentModeStr = 'BottomLeft'; break;
    case 12: currentImageContentModeStr = 'BottomRight'; break;
    default: currentImageContentModeStr = 'ScaleAspectFit'; break;
  }
  
  pageProxy.getClientData()['ImageSectionContentMode'] = currentImageContentMode;
  pageProxy.getClientData()['ImageSectionContentModeStr'] = currentImageContentModeStr;

  return context.getPageProxy().redraw();
}
