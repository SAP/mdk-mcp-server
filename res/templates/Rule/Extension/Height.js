export default function Height(context) {
  const platformModule = context.nativescript.platformModule;
  if (platformModule.isIOS) {
    return 163;
  } else {
    return 160;
  }
}
