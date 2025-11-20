export default function TextTab1(context) {
    var value = (Math.floor((Math.random() * 100) + 1)).toString();
    context.nativescript.appSettingsModule.setString('Tab1', value);
    return value;
}
