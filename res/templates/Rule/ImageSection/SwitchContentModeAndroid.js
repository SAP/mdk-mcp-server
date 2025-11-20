export default function SwitchContentModeAndroid(context) {
  let pageProxy = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  let currentImageContentMode = pageProxy.getClientData()['ImageSectionContentMode'];
  if (currentImageContentMode == undefined) {
    currentImageContentMode = 1
  }
  currentImageContentMode = currentImageContentMode + 1;
  if (currentImageContentMode === 8) {
    currentImageContentMode = 0
  }

  let currentImageContentModeStr = 'ScaleAspectFit';
  switch(currentImageContentMode) {
    case 0: currentImageContentModeStr = 'ScaleToFill'; break;
    case 1: currentImageContentModeStr = 'ScaleAspectFit'; break;
    case 2: currentImageContentModeStr = 'ScaleAspectFill'; break;
    case 3: currentImageContentModeStr = 'Center'; break;
    case 4: currentImageContentModeStr = 'CenterInside'; break;
    case 5: currentImageContentModeStr = 'FitEnd'; break;
    case 6: currentImageContentModeStr = 'FitStart'; break;
    case 7: currentImageContentModeStr = 'Matrix'; break;
    default: currentImageContentModeStr = 'ScaleAspectFit'; break;
  }
  
  pageProxy.getClientData()['ImageSectionContentMode'] = currentImageContentMode;
  pageProxy.getClientData()['ImageSectionContentModeStr'] = currentImageContentModeStr;

  return context.getPageProxy().redraw();
}


/* Android
enum MDKImageContentMode: String {
  case ScaleToFill
  case ScaleAspectFit
  case ScaleAspectFill
  case Center
  case CenterInside
  case FitEnd
  case FitStart
  case Matrix
}
*/
