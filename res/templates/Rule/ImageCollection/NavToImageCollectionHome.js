export default function NavToImageCollectionHome(mdkAPI) {
  const platformModule = mdkAPI.nativescript.platformModule;
  if (platformModule.isIOS) {
    mdkAPI.executeAction('/MDKDevApp/Actions/Navigation/ImageCollectionSection/NavToImageCollectionHome.action');
  } else {
    mdkAPI.executeAction('/MDKDevApp/Actions/Navigation/ImageCollectionSection/NavToImageCollectionHome.action');
  }
}