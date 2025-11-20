export default function GetImage(context) {
  // when image is a font icon, the targetpath is not resolving recursively.
  // so need to use rule instead of targetpath
  let pageProxy = context.evaluateTargetPathForAPI('#Page:SeamDevApp');
  return pageProxy.getClientData()['ImageSectionImagePath'];
}
