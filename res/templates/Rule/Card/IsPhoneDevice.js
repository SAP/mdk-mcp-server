export default function IsPhoneDevice(context) {
  return context.nativescript.platformModule.device.deviceType === 'Phone';
}
