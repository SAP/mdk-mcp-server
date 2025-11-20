export default function DisableForAndroid(context) {
  const platformModule = context.nativescript.platformModule;
  return platformModule.isIOS;
}