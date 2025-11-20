export default function MDKDevAppOnLoaded(context) {
  let pageProxy = context.getPageProxy();
  pageProxy.getClientData()['ImageSectionContentModeStr'] = 'ScaleAspectFit';
  pageProxy.getClientData()['ImageSectionImagePath'] = '/MDKDevApp/Images/waterfall_panorama.png';
  pageProxy.getClientData()['ImageSectionImageName'] = 'waterfall_panorama.png';
}