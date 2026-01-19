export default function DisableForIOS(context) {
  const platformModule = context.nativescript.platformModule;
  return platformModule.isAndroid;
}